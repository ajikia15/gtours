"use client";

import { useState } from "react";
import { sendTestEmail } from "@/data/testEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    emailId?: string;
  } | null>(null);

  const handleSendTest = async () => {
    if (!email) {
      setResult({ success: false, error: "Please enter an email address" });
      return;
    }

    setLoading(true);
    try {
      const response = await sendTestEmail(email);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send test email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Email System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test"
            />
          </div>

          <Button
            onClick={handleSendTest}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Test Email"}
          </Button>

          {result && (
            <div
              className={`p-4 rounded ${
                result.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result.success ? (
                <div>
                  <p>✅ Test email queued successfully!</p>
                  <p className="text-sm">Email ID: {result.emailId}</p>
                  <p className="text-sm mt-2">
                    Check the Firebase Console → Firestore → mail collection to
                    see the email document.
                  </p>
                </div>
              ) : (
                <p>❌ Error: {result.error}</p>
              )}
            </div>
          )}          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Instructions:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Enter your email address above</li>
              <li>Click &quot;Send Test Email&quot;</li>
              <li>Check Firebase Console → Firestore → mail collection</li>
              <li>Check the &quot;delivery&quot; field in the document for status</li>
              <li>If email extension is configured correctly, you should receive the email</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p><strong>Common SMTP Configuration Issues:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><code>ECONNREFUSED 127.0.0.1:465</code> - SMTP not configured properly</li>
                <li><code>Invalid login</code> - Wrong credentials</li>
                <li><code>535 Authentication failed</code> - Need app password for Gmail</li>
              </ul>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p><strong>Quick Gmail Setup:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Enable 2-Factor Authentication on Gmail</li>
                <li>Generate App Password in Google Account settings</li>
                <li>Use: <code>smtps://email:app-password@smtp.gmail.com:465</code></li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
