export async function load() {
  const events = [
    {
      id: 'evt_1',
      slug: 'ai-workshop-series-2025',
      startDate: new Date('2025-04-15T09:00:00'),
      endDate: new Date('2025-04-15T17:00:00'),
      featured: true,
      translation: {
        title: 'AI Workshop Series 2025',
        summary: 'Join our hands-on workshop series covering the latest developments in artificial intelligence and machine learning',
        location: 'Innovation Lab'
      }
    },
    {
      id: 'evt_2',
      slug: 'research-symposium-2025',
      startDate: new Date('2025-04-20T09:00:00'),
      endDate: new Date('2025-04-22T17:00:00'),
      featured: true,
      translation: {
        title: 'Student Research Symposium 2025',
        summary: 'Annual research symposium showcasing student projects and innovations across multiple disciplines',
        location: 'Main Auditorium'
      }
    }
  ];

  return {
    events
  };
}