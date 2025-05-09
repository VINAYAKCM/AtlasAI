export async function fetchAISummary(placeName: string, reviews: string[]): Promise<string> {
  const response = await fetch('http://localhost:8000/summarize-reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ place_name: placeName, reviews })
  });
  if (!response.ok) throw new Error('Failed to fetch AI summary');
  const data = await response.json();
  return data.summary;
}

export async function fetchAIAnswer(
  placeName: string, 
  reviews: string[], 
  question: string,
  placeDetails: Record<string, any>
): Promise<string> {
  const response = await fetch('http://localhost:8000/qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      place_name: placeName, 
      reviews, 
      question,
      place_details: placeDetails 
    })
  });
  if (!response.ok) throw new Error('Failed to fetch AI answer');
  const data = await response.json();
  return data.answer;
} 