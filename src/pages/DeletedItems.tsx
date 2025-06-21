
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, RotateCcw, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DeletedResumeData {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFile?: File;
  cvFile?: File;
  customSections: Array<{ id: string; name: string; content: string }>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const DeletedItems = () => {
  const { toast } = useToast();
  const [deletedResumes, setDeletedResumes] = useState<DeletedResumeData[]>([]);

  useEffect(() => {
    const savedDeleted = localStorage.getItem('deletedResumes');
    if (savedDeleted) {
      const parsed = JSON.parse(savedDeleted);
      const formatted = parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        deletedAt: new Date(item.deletedAt)
      }));
      setDeletedResumes(formatted);
    }
  }, []);

  const handleRestore = (resumeId: string) => {
    const resumeToRestore = deletedResumes.find(r => r.id === resumeId);
    if (resumeToRestore) {
      // Remove from deleted items
      const updatedDeleted = deletedResumes.filter(r => r.id !== resumeId);
      setDeletedResumes(updatedDeleted);
      localStorage.setItem('deletedResumes', JSON.stringify(updatedDeleted));

      // Add back to main resumes (simulate by showing toast)
      toast({
        title: "Application Restored",
        description: `${resumeToRestore.jobTitle} at ${resumeToRestore.companyName} has been restored to your dashboard.`
      });
    }
  };

  const handlePermanentDelete = (resumeId: string) => {
    const resumeToDelete = deletedResumes.find(r => r.id === resumeId);
    if (resumeToDelete) {
      const updatedDeleted = deletedResumes.filter(r => r.id !== resumeId);
      setDeletedResumes(updatedDeleted);
      localStorage.setItem('deletedResumes', JSON.stringify(updatedDeleted));

      toast({
        title: "Application Permanently Deleted",
        description: `${resumeToDelete.jobTitle} at ${resumeToDelete.companyName} has been permanently deleted.`,
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const getInitials = (companyName: string) => {
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onNewClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Deleted Items
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Applications you've deleted. Restore them or delete permanently.
          </p>
        </div>

        {deletedResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No deleted items
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Applications you delete will appear here for easy restoration.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deletedResumes.map((resume, index) => (
              <Card 
                key={resume.id} 
                className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg opacity-75">
                        {getInitials(resume.companyName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {resume.jobTitle}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <Building className="w-4 h-4 mr-1 flex-shrink-0" />
                          {resume.companyName}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {resume.jobDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 opacity-75">
                        {resume.jobDescription.slice(0, 120)}
                        {resume.jobDescription.length > 120 && '...'}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-red-600 dark:text-red-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Deleted {formatDate(resume.deletedAt)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(resume.id)}
                        className="flex-1 text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePermanentDelete(resume.id)}
                        className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Forever
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeletedItems;
