import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <ClerkSignUp 
        routing="path" 
        path="/signup"
        signInUrl="/signin"
        redirectUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg border-0",
          },
        }}
      />
    </div>
  );
};

export default SignUp;