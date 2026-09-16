import { getCollection } from 'astro:content';

export async function GET() {
  const collections = ['diagnostic', 'capteurs', 'actionneurs', 'electricite', 'can', 'dtc', 'programmation', 'ecu', 'eeprom', 'immo', 'outils', 'casreels', 'symptomes', 'methodologie'];
  
  let allData: any[] = [];
  
  for (const coll of collections) {
    try {
      const entries = await getCollection(coll as any);
      if (entries) {
        allData = [...allData, ...entries.map(e => ({
          title: e.data.title || e.data.name,
          slug: e.id,
          collection: coll,
          dtc: e.data.dtc || [],
          symptom: e.data.symptom || [],
          brand: e.data.brand || [],
          tool: e.data.tool || [],
          system: e.data.system || '',
        }))];
      }
    } catch(e) {
      // Ignorer les collections vides
    }
  }

  return new Response(JSON.stringify(allData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
