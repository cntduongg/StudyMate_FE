export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  title: string;
  author: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  upvotes: number;
  comments: Comment[];
  tags: string[];
}

const users: User[] = [
  { id: 'u1', name: 'Alex Johnson', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'u2', name: 'Maria Garcia', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'u3', name: 'Kenji Tanaka', avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg' },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    title: 'Just finished the Google Data Analytics course! Any tips for a first project?',
    author: users[0],
    timestamp: '3 hours ago',
    content: "Hey everyone! I've just completed the Google Data Analytics Professional Certificate and I'm super excited to apply what I've learned. I'm looking for some interesting public datasets to work on for my first portfolio project. Any recommendations or tips on where to start would be greatly appreciated!",
    upvotes: 128,
    tags: ['Data Analytics', 'Career Advice', 'Portfolio'],
    comments: [
      {
        id: 'c1',
        author: users[1],
        timestamp: '2 hours ago',
        content: "That's awesome, congrats! Kaggle is a great place to start. They have tons of datasets and competitions. I'd recommend the 'Titanic: Machine Learning from Disaster' dataset. It's a classic for a reason!"
      },
      {
        id: 'c2',
        author: users[2],
        timestamp: '1 hour ago',
        content: "I agree with Maria. Also, check out data.gov for a wide range of government datasets. They can be a bit messy, which is great practice for data cleaning! Good luck!"
      }
    ]
  },
  {
    id: 'p2',
    title: 'My cozy study setup for late-night coding sessions',
    author: users[1],
    timestamp: '1 day ago',
    content: "Sharing my little corner of productivity. A good setup makes all the difference when you're debugging at 2 AM. What does your study space look like? Share some pics!",
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1170',
    upvotes: 452,
    tags: ['Study Space', 'Productivity', 'WFH'],
    comments: [
      {
        id: 'c3',
        author: users[0],
        timestamp: '22 hours ago',
        content: "Love the clean setup and the mechanical keyboard! Which one is it?"
      }
    ]
  },
  {
    id: 'p3',
    title: 'Struggling with React Hooks. Can someone explain useEffect dependencies?',
    author: users[2],
    timestamp: '2 days ago',
    content: "I'm having a hard time understanding the dependency array in the useEffect hook. Sometimes my component gets into an infinite loop, and other times it doesn't update when it should. Can anyone provide a simple explanation or a good resource to understand it better?",
    upvotes: 76,
    tags: ['React', 'JavaScript', 'Help'],
    comments: []
  }
];
