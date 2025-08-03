
import { getAchievements } from './actions';
import { AchievementForm, DeleteAchievementButton } from '@/components/admin/achievements-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Achievements</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete your achievements.
                </p>
            </div>
            <AchievementForm />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Achievements</CardTitle>
                <CardDescription>View and manage all your current achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Category</TableHead>
                             <TableHead>Date</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {achievements.length > 0 ? (
                            achievements.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image 
                                            src={item.imageUrl}
                                            alt={item.title}
                                            width={80}
                                            height={50}
                                            className="rounded-sm object-cover"
                                            data-ai-hint={item.imageAiHint}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.issuer}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category}</Badge>
                                    </TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>
                                        {item.link ? (
                                            <Link href={item.link} target="_blank">
                                                <Button variant="ghost" size="icon">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <AchievementForm achievementToEdit={item} />
                                            <DeleteAchievementButton id={item.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                         ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">No achievements found.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
