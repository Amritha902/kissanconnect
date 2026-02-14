
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CommunityPage() {
    const posts = [
        {
            id: 1,
            author: "Madan Gowda",
            authorImage: "farmer3",
            time: "2 hours ago",
            text: "Heavy rains expected next week in the Hoskote region. Make sure to protect your crops!",
            likes: 15,
            comments: 3,
        },
        {
            id: 2,
            author: "Suresh Patel",
            authorImage: "farmer2",
            time: "1 day ago",
            text: "I have an excess of organic fertilizer. Anyone interested? I'm in Sarjapur.",
            likes: 8,
            comments: 1,
        }
    ]

  return (
    <div>
      <PageHeader title="Farmer Community" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-4 flex gap-2">
                <Input placeholder="Share an update with your community..." />
                <Button>Post</Button>
            </CardContent>
        </Card>

        <div className="space-y-4">
            {posts.map(post => {
                const authorImage = PlaceHolderImages.find(p => p.id === post.authorImage);
                return (
                    <Card key={post.id}>
                        <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                             <Avatar>
                                {authorImage && <AvatarImage src={authorImage.imageUrl} alt={post.author} />}
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{post.author}</p>
                                <p className="text-xs text-muted-foreground">{post.time}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <p className="text-foreground/90">{post.text}</p>
                            <div className="flex items-center gap-6 mt-4 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <MessageSquare className="mr-2 h-4 w-4" /> {post.comments}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
}
