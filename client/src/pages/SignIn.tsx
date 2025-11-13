import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <ClerkSignIn 
        routing="path" 
        path="/signin"
        signUpUrl="/signup"
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

export default SignIn;