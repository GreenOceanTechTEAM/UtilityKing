
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // The target URL of your .NET WebMethod
  const targetUrl = 'https://server.utilityking.co.uk/testreactasp.aspx/reactasp';

  try {
    // In a real production environment, you would forward the request.
    // However, in this development environment, outbound requests may be blocked.
    // We will simulate a successful response from the .NET backend.

    // 1. Read the incoming request body to show it's being received.
    const requestBody = await request.json();
    console.log("Proxy received request with body:", requestBody);

    // 2. Simulate a successful response payload from the .NET backend.
    // This is a mock structure based on what the frontend expects.
    const mockApiResponse = {
        success: true,
        recommendedPlans: [
            { supplier: "Sim-British Gas", yearlycost: "1150.75", standingcharge: "50.2", unitrate: "25.8", duration: "12 Months" },
            { supplier: "Sim-EDF", yearlycost: "1205.40", standingcharge: "48.9", unitrate: "26.5", duration: "24 Months" },
            { supplier: "Sim-Octopus", yearlycost: "1180.00", standingcharge: "51.0", unitrate: "26.1", duration: "12 Months", features: ["100% Renewable"] }
        ]
    };
    
    // The .NET backend seems to double-encode the JSON response into a string within a 'd' property.
    // We will replicate that behavior here.
    const dotnetStyleResponse = {
      d: JSON.stringify(mockApiResponse.recommendedPlans)
    };

    // 3. Send the simulated successful response back to the Next.js client.
    return NextResponse.json(dotnetStyleResponse);

  } catch (error: any) {
    console.error('Error in webhook proxy:', error);
    return new NextResponse(
      `An internal error occurred in the proxy: ${error.message}`,
      { status: 500 }
    );
  }
}
