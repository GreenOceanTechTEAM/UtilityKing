
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your new, dedicated API endpoint
  const targetUrl = 'https://utilityking.co.uk/api/lead';

  try {
    const requestBody = await request.json();

    // Forward the request to the new .NET API endpoint
    const apiResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.DOTNET_API_KEY || 'your_secure_api_key_here',
        },
        body: JSON.stringify(requestBody), // Send the body directly
    });
    
    // Check if the external API call was successful
    if (!apiResponse.ok) {
        const errorDetails = await apiResponse.text();
        console.error('Error from .NET backend:', errorDetails);
        // Return a structured error response
        return NextResponse.json({ message: `Error from backend: ${errorDetails}` }, { status: apiResponse.status });
    }

    // Assuming the backend returns JSON on success
    const resultJson = await apiResponse.json();
    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error('Error in db webhook proxy:', error);
    return NextResponse.json(
        { message: `An internal error occurred in the proxy: ${error.message}` },
        { status: 500 }
    );
  }
}
