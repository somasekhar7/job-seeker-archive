
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, Calendar, FileText, Edit, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';

interface ResumeData {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFile?: File;
  cvFile?: File;
  customSections: Array<{ id: string; name: string; content: string }>;
  createdAt: Date;
  updatedAt: Date;
}

interface ResumeDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData | null;
  onEdit: (resume: ResumeData) => void;
  onDelete: (resumeId: string) => void;
}

const ResumeDetailView: React.FC<ResumeDetailViewProps> = ({
  isOpen,
  onClose,
  resume,
  onEdit,
  onDelete
}) => {
  if (!resume) return null;

  const formatDate = (date: Date) => {
    return format(date, 'MMMM dd, yyyy \'at\' hh:mm a');
  };

  const getInitials = (companyName: string) => {
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleDownload = (file: File, fileName: string) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(resume.companyName)}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resume.jobTitle}
                </DialogTitle>
                <DialogDescription className="flex items-center text-lg text-gray-600 dark:text-gray-300 mt-1">
                  <Building className="w-5 h-5 mr-2" />
                  {resume.companyName}
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onEdit(resume)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(resume.id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created: {formatDate(resume.createdAt)}
            </div>
            {resume.updatedAt !== resume.createdAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Updated: {formatDate(resume.updatedAt)}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Description */}
          {resume.jobDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resume.jobDescription}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {(resume.resumeFile || resume.cvFile) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Attached Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.resumeFile && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Resume</p>
                          <p className="text-xs text-gray-500">{resume.resumeFile.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(resume.resumeFile!, resume.resumeFile!.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {resume.cvFile && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Cover Letter</p>
                          <p className="text-xs text-gray-500">{resume.cvFile.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(resume.cvFile!, resume.cvFile!.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Sections */}
          {resume.customSections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resume.customSections.map((section, index) => (
                  <div key={section.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div>
                      <h4 className="font-semibold text-base mb-2 text-gray-900 dark:text-white">
                        {section.name}
                      </h4>
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDetailView;
