
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ResumeForm from '@/components/ResumeForm';
import ResumeCard from '@/components/ResumeCard';
import ResumeDetailView from '@/components/ResumeDetailView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, SortAsc } from 'lucide-react';

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

const Dashboard = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'title'>('date');

  // Load demo data on component mount
  useEffect(() => {
    const demoData: ResumeData[] = [
      {
        id: '1',
        companyName: 'Google',
        jobTitle: 'Senior Software Engineer',
        jobDescription: 'We are looking for a senior software engineer to join our team and work on cutting-edge technology that impacts billions of users worldwide. You will be responsible for designing and implementing scalable systems.',
        customSections: [
          { id: '1', name: 'Interview Notes', content: 'Phone screen scheduled for next week. Focus on system design and algorithms.' },
          { id: '2', name: 'Follow-up', content: 'Send thank you email after each interview round.' }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        companyName: 'Microsoft',
        jobTitle: 'Product Manager',
        jobDescription: 'Join our product team to drive innovation in cloud computing. You will work closely with engineering teams to define product roadmaps and deliver features that delight customers.',
        customSections: [
          { id: '3', name: 'Preparation Notes', content: 'Research Azure products and competitive landscape.' }
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: '3',
        companyName: 'Apple',
        jobTitle: 'iOS Developer',
        jobDescription: 'Work on the next generation of iOS applications that will be used by millions of people. You will collaborate with design and backend teams to create seamless user experiences.',
        customSections: [],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ];
    setResumes(demoData);
    setFilteredResumes(demoData);
  }, []);

  // Filter and sort resumes
  useEffect(() => {
    let filtered = resumes.filter(resume => 
      resume.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort resumes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        case 'title':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'date':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    setFilteredResumes(filtered);
  }, [resumes, searchTerm, sortBy]);

  const handleCreateResume = (data: ResumeData) => {
    const newResume: ResumeData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setResumes(prev => [newResume, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditResume = (data: ResumeData) => {
    setResumes(prev => prev.map(resume => 
      resume.id === editingResume?.id 
        ? { ...data, id: resume.id, createdAt: resume.createdAt, updatedAt: new Date() }
        : resume
    ));
    setEditingResume(null);
    setIsFormOpen(false);
    setIsDetailViewOpen(false);
  };

  const handleDeleteResume = (resumeId: string) => {
    const resumeToDelete = resumes.find(r => r.id === resumeId);
    if (resumeToDelete) {
      // Move to deleted items (simulate by removing from main list)
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      
      // Store in localStorage for deleted items page
      const deletedItems = JSON.parse(localStorage.getItem('deletedResumes') || '[]');
      deletedItems.push({ ...resumeToDelete, deletedAt: new Date() });
      localStorage.setItem('deletedResumes', JSON.stringify(deletedItems));
      
      toast({
        title: "Application Moved to Trash",
        description: `${resumeToDelete.jobTitle} at ${resumeToDelete.companyName} has been moved to deleted items.`
      });
      
      setIsDetailViewOpen(false);
    }
  };

  const handleViewResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setIsDetailViewOpen(true);
  };

  const handleEditClick = (resume: ResumeData) => {
    setEditingResume(resume);
    setIsFormOpen(true);
    setIsDetailViewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onNewClick={() => setIsFormOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Job Applications Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and track your job applications in one place
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by company or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === 'date' ? 'company' : sortBy === 'company' ? 'title' : 'date')}
              className="flex items-center gap-2 bg-white dark:bg-gray-800"
            >
              <SortAsc className="h-4 w-4" />
              Sort by {sortBy === 'date' ? 'Date' : sortBy === 'company' ? 'Company' : 'Title'}
            </Button>
          </div>
        </div>

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first job application to get started'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Create Your First Application
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResumes.map((resume, index) => (
              <div key={resume.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ResumeCard
                  resume={resume}
                  onView={handleViewResume}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteResume}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ResumeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResume(null);
        }}
        onSubmit={editingResume ? handleEditResume : handleCreateResume}
        initialData={editingResume || undefined}
        mode={editingResume ? 'edit' : 'create'}
      />

      <ResumeDetailView
        isOpen={isDetailViewOpen}
        onClose={() => {
          setIsDetailViewOpen(false);
          setSelectedResume(null);
        }}
        resume={selectedResume}
        onEdit={handleEditClick}
        onDelete={handleDeleteResume}
      />
    </div>
  );
};

export default Dashboard;
