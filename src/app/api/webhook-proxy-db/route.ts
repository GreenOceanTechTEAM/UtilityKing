
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET page
  const targetUrl = 'https://utilityking.co.uk/api.aspx';

  try {
    const requestBody = await request.json();

    // The entire body, including the 'requestData' wrapper, is sent.
    // The C# backend will now parse this from the request stream.
    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.DOTNET_API_KEY || '',
        },
        body: JSON.stringify(requestBody),
    });
    
    if (!apiResponse.ok) {
        const errorDetails = await apiResponse.text();
        // The .NET page now returns plain text on error
        return NextResponse.json({ d: `Error: ${errorDetails}` }, { status: apiResponse.status });
    }

    // The .NET page now returns a simple string on success
    const resultText = await apiResponse.text();
    // We wrap it in the { d: "..." } structure that the frontend expects
    return NextResponse.json({ d: resultText });

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    return NextResponse.json(
        { d: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
