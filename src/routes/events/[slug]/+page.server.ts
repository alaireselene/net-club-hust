import { error } from '@sveltejs/kit';

const events = [
  {
    id: 'evt_1',
    slug: 'ai-workshop-series-2025',
    startDate: new Date('2025-04-15T09:00:00'),
    endDate: new Date('2025-04-15T17:00:00'),
    featured: true,
    categoryName: 'Workshop',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&h=800',
    isOnline: false,
    registrationUrl: 'https://register.example.com/ai-workshop-2025',
    host: {
      name: 'Dr. Mai Thanh Tung',
      role: 'AI Research Lead',
      avatarUrl: 'https://i.pravatar.cc/300'
    },
    sponsors: [
      {
        name: 'VinAI Research',
        logoUrl: 'https://www.vinai.io/wp-content/uploads/2021/12/logo-1.png'
      }
    ],
    translation: {
      title: 'AI Workshop Series 2025',
      summary: 'Join our hands-on workshop series covering the latest developments in artificial intelligence and machine learning',
      content: `<p>We are excited to present the AI Workshop Series 2025, a special event focused on exploring and practicing with modern AI technologies.</p>
        <p>Topics include:</p>
        <ul>
          <li>Deep Learning</li>
          <li>Computer Vision</li>
          <li>Natural Language Processing</li>
        </ul>
        <p>Each session will include hands-on exercises and real-world applications.</p>
        <p><strong>Prerequisites:</strong></p>
        <ul>
          <li>Basic Python programming</li>
          <li>Understanding of machine learning concepts</li>
          <li>Laptop with Google Colab access</li>
        </ul>`,
      location: 'Innovation Lab, Building B1',
      isAiTranslated: false
    }
  },
  {
    id: 'evt_2',
    slug: 'research-symposium-2025',
    startDate: new Date('2025-04-20T09:00:00'),
    endDate: new Date('2025-04-22T17:00:00'),
    featured: true,
    categoryName: 'Symposium',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&h=800',
    isOnline: false,
    registrationUrl: 'https://register.example.com/symposium-2025',
    host: {
      name: 'Prof. Nguyen Van Minh',
      role: 'Research Director',
      avatarUrl: 'https://i.pravatar.cc/300?img=12'
    },
    sponsors: [
      {
        name: 'Science & Technology Fund',
        logoUrl: 'https://placehold.co/200x80?text=STF'
      },
      {
        name: 'Innovation Center',
        logoUrl: 'https://placehold.co/200x80?text=IC'
      }
    ],
    translation: {
      title: 'Student Research Symposium 2025',
      summary: 'Annual research symposium showcasing student projects and innovations across multiple disciplines',
      content: `<p>The Student Research Symposium is our flagship annual event showcasing outstanding research projects from the student community.</p>
        <p>The event includes:</p>
        <ul>
          <li>Poster presentations</li>
          <li>Research talks</li>
          <li>Project demonstrations</li>
        </ul>
        <p>Join us for three days of inspiring research presentations and networking opportunities.</p>
        <p><strong>Key Information:</strong></p>
        <ul>
          <li>Abstract submission deadline: March 15, 2025</li>
          <li>Poster size requirements: A0 format</li>
          <li>Presentation slots: 20 minutes + 5 minutes Q&A</li>
        </ul>`,
      location: 'Main Auditorium, Building D6',
      isAiTranslated: false
    }
  }
];

export async function load({ params }) {
  const event = events.find(e => e.slug === params.slug);

  if (!event) {
    throw error(404, {
      message: 'Event not found'
    });
  }

  return {
    event
  };
}