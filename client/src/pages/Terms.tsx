import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/signup">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using DevOverflow, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">2. Community Guidelines</h3>
              <p className="text-muted-foreground mb-3">
                Our community is built on respect and collaboration. Users must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Be respectful and professional in all interactions</li>
                <li>Provide accurate and helpful information</li>
                <li>Respect intellectual property rights</li>
                <li>Not engage in spam or malicious activities</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">3. Content Policy</h3>
              <p className="text-muted-foreground">
                Users are responsible for the content they post. We reserve the right to remove content that violates our community guidelines.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">4. Privacy</h3>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;