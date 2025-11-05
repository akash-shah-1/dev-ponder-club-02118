import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Help & FAQ</h1>
                <p className="text-sm md:text-base text-muted-foreground">Find answers to common questions</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">How do I ask a good question?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        A good question should be clear, specific, and include relevant code examples. 
                        Make sure to search for similar questions first, provide context about what you've tried, 
                        and format your code properly.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">How does reputation work?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        You earn reputation by asking good questions, providing helpful answers, and editing posts. 
                        Upvotes give you +10 reputation, accepted answers give you +15, and downvotes cost you -2.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">What are badges and how do I earn them?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Badges are awards for specific achievements. You can earn bronze, silver, and gold badges 
                        for activities like answering questions, participating in the community, and maintaining quality content.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">How do I format code in my posts?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use backticks (`) for inline code and triple backticks (```) for code blocks. 
                        You can also use the code formatting button in the editor toolbar.
                      </p>
                      <pre className="bg-muted p-2 rounded text-xs">
{`// Example inline code: \`const x = 5;\`

// Example code block:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\``}
                      </pre>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">What should I do if my question is marked as duplicate?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        If your question is marked as duplicate, check the linked question first. 
                        If it doesn't answer your specific issue, edit your question to explain the difference 
                        and request reopening.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left">How can I improve my answer acceptance rate?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Provide clear, detailed answers with working code examples. Explain the why, not just the how. 
                        Test your solutions, and be responsive to comments and clarification requests.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you couldn't find the answer you're looking for, feel free to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Ask a question on our Meta site</li>
                  <li>Browse our comprehensive documentation</li>
                  <li>Contact our support team</li>
                  <li>Join our community chat</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Help;
