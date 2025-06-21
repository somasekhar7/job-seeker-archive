
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Upload } from 'lucide-react';

interface CustomSection {
  id: string;
  name: string;
  content: string;
}

interface ResumeData {
  id?: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeFile?: File;
  cvFile?: File;
  customSections: CustomSection[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResumeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResumeData) => void;
  initialData?: ResumeData;
  mode: 'create' | 'edit';
}

const ResumeForm: React.FC<ResumeFormProps> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ResumeData>({
    companyName: initialData?.companyName || '',
    jobTitle: initialData?.jobTitle || '',
    jobDescription: initialData?.jobDescription || '',
    customSections: initialData?.customSections || [],
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'resumeFile' | 'cvFile', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file || undefined }));
  };

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      name: '',
      content: ''
    };
    setFormData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
  };

  const updateCustomSection = (id: string, field: 'name' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeCustomSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both company name and job title.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
      toast({
        title: mode === 'create' ? "Application Created" : "Application Updated",
        description: `Successfully ${mode === 'create' ? 'created' : 'updated'} your application for ${formData.jobTitle} at ${formData.companyName}.`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} application. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'New Job Application' : 'Edit Application'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new job application to your vault' : 'Update your job application details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="bg-white dark:bg-gray-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="e.g. Software Engineer, Product Manager"
                className="bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange('jobDescription', e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[120px] bg-white dark:bg-gray-700"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resumeFile">Resume</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="resumeFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('resumeFile', e.target.files?.[0] || null)}
                  className="bg-white dark:bg-gray-700"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvFile">Cover Letter</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="cvFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('cvFile', e.target.files?.[0] || null)}
                  className="bg-white dark:bg-gray-700"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Custom Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Custom Sections</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSection}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            {formData.customSections.map((section) => (
              <Card key={section.id} className="bg-gray-50 dark:bg-gray-700/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <Input
                      value={section.name}
                      onChange={(e) => updateCustomSection(section.id, 'name', e.target.value)}
                      placeholder="Section name (e.g. Notes, Follow-up)"
                      className="font-medium bg-white dark:bg-gray-700"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSection(section.id)}
                      className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                    placeholder="Add your content here..."
                    className="bg-white dark:bg-gray-700"
                    rows={3}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Application' : 'Update Application')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeForm;
