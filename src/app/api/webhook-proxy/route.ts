
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://server.utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    const requestBody = await request.json();

    // The backend expects the data to be wrapped in a specific structure.
    const payloadForBackend = {
        requestData: requestBody
    };

    // Make the fetch call to the .NET backend.
    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // It's good practice to secure your backend endpoint with a key.
            // Using a placeholder here. In a real app, use an environment variable.
            'X-API-KEY': process.env.DOTNET_API_KEY || 'your_secure_api_key_here',
        },
        body: JSON.stringify(payloadForBackend),
    });
    
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`Error from .NET backend (${apiResponse.status}):`, errorText);
        return NextResponse.json({ message: `Error from backend: ${errorText}` }, { status: apiResponse.status });
    }

    const resultJson = await apiResponse.json();
    
    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error('Error in webhook proxy:', error);
    return NextResponse.json(
        { message: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
