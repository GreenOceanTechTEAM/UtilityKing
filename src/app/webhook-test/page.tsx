
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WebhookResult {
  data: any | null;
  error: string | null;
  status: number | null;
}

export default function WebhookTestPage() {
  const [result, setResult] = useState<WebhookResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The proxy route in our Next.js app
  const webhookUrl = '/api/webhook-proxy'; 
  const targetUrl = 'https://utilityking.co.uk/testreactasp.aspx';

  useEffect(() => {
    const callWebhook = async () => {
      setIsLoading(true);
      try {
        // The request is now made to our own backend
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const status = response.status;
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(`Proxy error! Status: ${status}. Response: ${responseText}`);
        }
        
        try {
          const data = JSON.parse(responseText);
          setResult({ data, error: null, status });
        } catch (parseError) {
          // Handle cases where response is not valid JSON
          setResult({ data: {rawResponse: responseText}, error: null, status });
        }

      } catch (error: any) {
        setResult({ data: null, error: error.message || 'An unknown error occurred.', status: null });
      } finally {
        setIsLoading(false);
      }
    };

    callWebhook();
  }, []);

  return (
    <div className="p-4 bg-background text-foreground font-code">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Webhook Proxy Test
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Attempting to connect to: <code className="bg-muted px-1 py-0.5 rounded">{targetUrl}</code> via internal proxy.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Connecting via proxy...</span>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4">
              {result.error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-3 text-destructive font-semibold">
                    <AlertTriangle className="h-6 w-6" />
                    <p>Connection Failed</p>
                  </div>
                  <pre className="mt-2 text-sm whitespace-pre-wrap break-all bg-destructive/5 p-3 rounded">
                    {result.error}
                  </pre>
                </div>
              ) : (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                   <div className="flex items-center gap-3 text-primary font-semibold mb-2">
                    <CheckCircle className="h-6 w-6" />
                    <p>Connection Successful!</p>
                     {result.status && <Badge variant="secondary">Status: {result.status}</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Received Data:</h3>
                  <pre className="text-sm whitespace-pre-wrap break-all bg-background/50 p-3 rounded-md shadow-inner">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
