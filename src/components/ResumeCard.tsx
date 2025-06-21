
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, FileText, Building } from 'lucide-react';
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

interface ResumeCardProps {
  resume: ResumeData;
  onView: (resume: ResumeData) => void;
  onEdit: (resume: ResumeData) => void;
  onDelete: (resumeId: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const getInitials = (companyName: string) => {
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800 border-0 shadow-sm animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(resume)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(resume); }} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(resume); }} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }} 
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {resume.jobDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {resume.jobDescription.slice(0, 120)}
              {resume.jobDescription.length > 120 && '...'}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(resume.createdAt)}
              </div>
              {(resume.resumeFile || resume.cvFile) && (
                <div className="flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  {[resume.resumeFile && 'Resume', resume.cvFile && 'Cover Letter'].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
            
            {resume.customSections.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{resume.customSections.length} sections
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeCard;
