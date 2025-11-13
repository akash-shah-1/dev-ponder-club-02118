import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
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
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
              <p className="text-muted-foreground mb-3">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Account information (name, email, profile details)</li>
                <li>Content you post (questions, answers, comments)</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
              <p className="text-muted-foreground mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Send you updates and notifications</li>
                <li>Ensure platform security</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3">5. Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@devoverflow.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;