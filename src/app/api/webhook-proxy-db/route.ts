
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://utilityking.co.uk/api.aspx/reactaspentrydb';

  try {
    const requestBody = await request.json();

    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.DOTNET_API_KEY || '',
        },
        body: JSON.stringify(requestBody.requestData),
    });
    
    if (!apiResponse.ok) {
        const errorDetails = await apiResponse.text();
        const errorMessage = `Failed to communicate with .NET backend. Status: ${apiResponse.status}. Details: ${errorDetails}`;
        // ASP.NET WebMethods can return complex error objects. We send back a JSON
        // object that mimics the expected { d: "..." } structure but contains the error.
        return NextResponse.json({ d: `Error: ${errorMessage}` }, { status: apiResponse.status });
    }

    const result = await apiResponse.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    // Ensure the response format is consistent even for internal proxy errors.
    return NextResponse.json(
        { d: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
