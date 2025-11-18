
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    // 1. Read the JSON body from the incoming Next.js client request.
    const requestBody = await request.json();

    // 2. Forward the request to your .NET backend.
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        // Set the correct headers for a JSON request.
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // 3. Stringify the body to ensure it's sent as a valid JSON string.
      body: JSON.stringify(requestBody),
    });

    // Check if the request to the .NET server was successful.
    if (!response.ok) {
      const errorText = await response.text();
      // Forward the error from the .NET server back to the Next.js client for debugging.
      return new NextResponse(
        `Failed to proxy request to .NET server: ${response.status} ${response.statusText} - ${errorText}`,
        { status: response.status }
      );
    }

    // 4. Get the JSON response from the .NET server.
    const data = await response.json();
    
    // 5. Send the successful response back to the Next.js client.
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in webhook proxy:', error);
    // Handle errors that occur within the proxy itself (e.g., network issues).
    return new NextResponse(
      `An internal error occurred in the proxy: ${error.message}`,
      { status: 500 }
    );
  }
}
