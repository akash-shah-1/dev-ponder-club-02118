import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from crewai_tools import BaseTool
import json
import psycopg2
from sqlalchemy import create_engine, inspect, text

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
ADMIN_PASSWORD_ENV = os.getenv("ADMIN_PASSWORD") # Password stored in .env for validation

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file.")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file.")
if not ADMIN_PASSWORD_ENV:
    raise ValueError("ADMIN_PASSWORD not found in .env file.")


# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(model="gemini-pro", verbose=True, temperature=0.1, google_api_key=GEMINI_API_KEY)

# --- Tools ---

class SQLSchemaInspectorTool(BaseTool):
    name: str = "SQL Schema Inspector"
    description: str = "Inspects the database schema to get table names and column names with their types."

    def _run(self, query: str = "") -> str:
        """
        Connects to the database and returns the schema information.
        The 'query' parameter is ignored for this tool but is required by BaseTool.
        """
        try:
            engine = create_engine(DATABASE_URL)
            inspector = inspect(engine)
            schema_info = {}
            for table_name in inspector.get_table_names():
                columns = inspector.get_columns(table_name)
                schema_info[table_name] = {col['name']: str(col['type']) for col in columns}
            return json.dumps(schema_info, indent=2)
        except Exception as e:
            return f"Error inspecting schema: {e}"

class SQLValidatorTool(BaseTool):
    name: str = "SQL Validator"
    description: "Validates a SQL query for safety (SELECT only, no DDL/DML), correct table/column names, and performs an EXPLAIN plan check."

    def _run(self, sql_query: str, admin_password_input: str) -> str:
        if admin_password_input != ADMIN_PASSWORD_ENV:
            return "Validation Error: Incorrect admin password provided. Cannot execute query."

        # Basic safety checks
        if any(keyword in sql_query.upper() for keyword in ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE", "TRUNCATE"]):
            return "Validation Error: SQL query contains forbidden keywords (DROP, DELETE, UPDATE, INSERT, ALTER, CREATE, TRUNCATE)."
        
        if not sql_query.upper().strip().startswith("SELECT"):
            return "Validation Error: Only SELECT queries are allowed."

        try:
            engine = create_engine(DATABASE_URL)
            with engine.connect() as connection:
                # Schema validation (simplified - can be enhanced)
                inspector = inspect(engine)
                schema_info = json.loads(SQLSchemaInspectorTool()._run()) # Get fresh schema info

                # Check tables and columns
                for table_name, cols in schema_info.items():
                    if table_name in sql_query:
                        for col_name in cols.keys():
                            if col_name not in sql_query:
                                # This is a very basic check, can lead to false positives/negatives
                                # A more robust solution would involve parsing the SQL.
                                pass 
                
                # EXPLAIN plan check for performance/validity
                # Some databases might require specific syntax or permissions for EXPLAIN
                # This is a basic check for PostgreSQL
                try:
                    explain_query = f"EXPLAIN {sql_query}"
                    connection.execute(text(explain_query)).fetchall()
                except Exception as e:
                    return f"Validation Error: EXPLAIN plan failed for the query. Details: {e}"

            return "SQL query is valid and safe."
        except Exception as e:
            return f"Validation Error during database interaction: {e}"

class SQLExecutorTool(BaseTool):
    name: str = "SQL Executor"
    description: "Executes a validated SQL SELECT query against the database and returns results."

    def _run(self, sql_query: str, admin_password_input: str) -> str:
        if admin_password_input != ADMIN_PASSWORD_ENV:
            return "Execution Error: Incorrect admin password provided. Cannot execute query."
        
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cur = conn.cursor()
            cur.execute(sql_query)
            
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description]
            
            cur.close()
            conn.close()

            results = []
            for row in rows:
                results.append(dict(zip(columns, row)))
            
            return json.dumps(results, indent=2)
        except Exception as e:
            return f"Execution Error: {e}"

# Instantiate Tools
schema_inspector_tool = SQLSchemaInspectorTool()
sql_validator_tool = SQLValidatorTool()
sql_executor_tool = SQLExecutorTool()

# --- Agents ---

sql_generator_agent = Agent(
    role="SQL Query Generator",
    goal="Generate a safe and correct SQL SELECT query based on the user's natural language request and the provided database schema.",
    backstory="You are an expert in translating natural language questions into precise SQL SELECT queries. You always refer to the provided database schema to ensure correct table and column names.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[schema_inspector_tool]
)

sql_validator_agent = Agent(
    role="SQL Query Validator",
    goal="Validate the generated SQL query for safety (no DDL/DML, only SELECT), correct schema usage, and query performance/validity using EXPLAIN.",
    backstory="You are a vigilant database security expert. You ensure that no harmful operations are attempted and that queries are well-formed and efficient. You require an admin password for validation.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[sql_validator_tool]
)

query_executor_agent = Agent(
    role="SQL Query Executor",
    goal="Execute the validated SQL SELECT query against the database and return the results.",
    backstory="You are a reliable database operator. You only execute queries that have been thoroughly validated. You require an admin password for execution.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[sql_executor_tool]
)

# --- Tasks ---

def create_crew_tasks(natural_language_query: str, admin_password: str):
    schema_task = Task(
        description="Inspect the database schema to provide context for SQL generation.",
        agent=sql_generator_agent,
        tools=[schema_inspector_tool],
        output_json=True
    )

    sql_generation_task = Task(
        description=f"Generate a SQL SELECT query for the following natural language request: '{natural_language_query}'. "
                    "Use the schema information from the previous task to ensure correctness. Only generate SELECT statements.",
        agent=sql_generator_agent,
        context=[schema_task],
        output_json=True
    )

    sql_validation_task = Task(
        description=f"Validate the generated SQL query. Ensure it is a safe SELECT query, uses correct table and column names based on the schema, and passes an EXPLAIN plan check. "
                    f"Use the admin password '{admin_password}' for validation.",
        agent=sql_validator_agent,
        context=[sql_generation_task],
        output_json=True
    )

    query_execution_task = Task(
        description=f"Execute the validated SQL SELECT query and return the results as JSON. "
                    f"Use the admin password '{admin_password}' for execution.",
        agent=query_executor_agent,
        context=[sql_validation_task],
        output_json=True
    )
    
    return [schema_task, sql_generation_task, sql_validation_task, query_execution_task]


# --- Crew Setup and Execution ---

def run_crew(natural_language_query: str, admin_password: str):
    tasks = create_crew_tasks(natural_language_query, admin_password)

    crew = Crew(
        agents=[sql_generator_agent, sql_validator_agent, query_executor_agent],
        tasks=tasks,
        verbose=2,
        process=Process.sequential
    )

    result = crew.kickoff()
    return result

# Example usage (for testing purposes, if run directly)
if __name__ == "__main__":
    test_query = "show me all users created this month"
    test_admin_password = "your_admin_password_from_env" # Replace with actual password from .env for local testing

    # The password for actual execution will come from the NestJS backend
    final_result = run_crew(test_query, test_admin_password) 
    print("\n\n##################################")
    print("## Here is the Crew's final result:")
    print("##################################\n")
    print(final_result)
