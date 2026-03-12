
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://server.utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    // 1. Get the raw request body from the incoming Next.js request.
    const requestBody = await request.json();

    // 2. The backend's C# WebMethod `reactasp` expects a single object parameter
    // named `requestData`. We must wrap our form data in an object with this exact key.
    const payloadForBackend = {
        requestData: requestBody
    };

    // 3. Make the fetch call to the .NET backend.
    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // It's good practice to secure your backend endpoint with a key.
            'X-API-KEY': process.env.DOTNET_API_KEY || 'your_secure_api_key_here',
        },
        // 4. Send the correctly structured and stringified payload.
        body: JSON.stringify(payloadForBackend),
    });
    
    // 5. Handle the response from the .NET backend.
    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`Error from .NET backend (${apiResponse.status}):`, errorText);
        // Ensure a JSON response is sent for errors too
        return NextResponse.json({ message: `Error from backend: ${errorText}` }, { status: apiResponse.status });
    }

    const resultJson = await apiResponse.json();
    
    // 6. Return the backend's response to the frontend client.
    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    return NextResponse.json(
        { message: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
