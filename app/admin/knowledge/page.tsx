'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Plus, X, Search, Edit, Trash2, Eye, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: 'mai-hoa' | 'nam-duoc' | 'bat-trach' | 'khai-huyet' | 'general';
  subcategory?: string;
  tags: string[];
  file_name?: string;
  file_type?: string;
  is_active: boolean;
  relevance_score: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'mai-hoa', label: 'Mai Hoa Dịch Số', color: 'bg-blue-100 text-blue-800' },
  { value: 'nam-duoc', label: 'Nam Dược', color: 'bg-green-100 text-green-800' },
  { value: 'bat-trach', label: 'Bát Trạch', color: 'bg-purple-100 text-purple-800' },
  { value: 'khai-huyet', label: 'Khai Huyệt', color: 'bg-orange-100 text-orange-800' },
  { value: 'general', label: 'Tổng Quát', color: 'bg-gray-100 text-gray-800' },
];

export default function AdminKnowledgePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Form state cho upload/edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'mai-hoa' as const,
    subcategory: '',
    tags: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/knowledge');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('[v0] Error fetching knowledge documents:', error);
      toast.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.md', '.txt', '.pdf'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.'));
    if (!validTypes.includes(fileExt)) {
      toast.error('Chỉ hỗ trợ file .md, .txt, .pdf');
      return;
    }

    // Read file content (for .md and .txt)
    if (fileExt === '.md' || fileExt === '.txt') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          file,
          content,
          title: prev.title || file.name.replace(fileExt, ''),
        }));
      };
      reader.readAsText(file);
    } else {
      // For PDF, just store the file
      setFormData(prev => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(fileExt, ''),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = editingDoc
        ? `/api/admin/knowledge/${editingDoc.id}`
        : '/api/admin/knowledge';
      
      const method = editingDoc ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save document');

      toast.success(editingDoc ? 'Cập nhật thành công' : 'Tải lên thành công');
      setIsDialogOpen(false);
      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error('[v0] Error saving document:', error);
      toast.error('Có lỗi xảy ra khi lưu tài liệu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete document');

      toast.success('Xóa thành công');
      fetchDocuments();
    } catch (error) {
      console.error('[v0] Error deleting document:', error);
      toast.error('Có lỗi xảy ra khi xóa tài liệu');
    }
  };

  const handleToggleActive = async (doc: KnowledgeDocument) => {
    try {
      const response = await fetch(`/api/admin/knowledge/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...doc, is_active: !doc.is_active }),
      });

      if (!response.ok) throw new Error('Failed to toggle active');

      toast.success(doc.is_active ? 'Đã tắt' : 'Đã kích hoạt');
      fetchDocuments();
    } catch (error) {
      console.error('[v0] Error toggling active:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const openEditDialog = (doc: KnowledgeDocument) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      content: doc.content,
      category: doc.category,
      subcategory: doc.subcategory || '',
      tags: doc.tags.join(', '),
      file: null,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDoc(null);
    setFormData({
      title: '',
      content: '',
      category: 'mai-hoa',
      subcategory: '',
      tags: '',
      file: null,
    });
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (filterCategory !== 'all' && doc.category !== filterCategory) return false;
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Kiến thức AI</h1>
          <p className="text-muted-foreground mt-1">
            Upload tài liệu y học Đông y để AI sử dụng khi phân tích
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm tài liệu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDoc ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
              </DialogTitle>
              <DialogDescription>
                Upload file .md, .txt hoặc nhập nội dung trực tiếp
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="file">Upload file (tùy chọn)</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".md,.txt,.pdf"
                    onChange={handleFileUpload}
                    className="max-w-xs"
                  />
                  {formData.file && (
                    <Badge variant="secondary">
                      <FileText className="w-3 h-3 mr-1" />
                      {formData.file.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="VD: Mai Hoa Core Logic"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div>
                <Label htmlFor="subcategory">Danh mục con (tùy chọn)</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  placeholder="VD: core-logic, herb-catalog"
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="VD: gan, mắt, đau đầu"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập nội dung tài liệu..."
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Hỗ trợ Markdown. {formData.content.length} ký tự
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
                  {editingDoc ? 'Cập nhật' : 'Tải lên'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm tài liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Đang tải...
            </CardContent>
          </Card>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Không tìm thấy tài liệu nào
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map(doc => (
            <Card key={doc.id} className={!doc.is_active ? 'opacity-50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{doc.title}</CardTitle>
                      <Badge
                        className={CATEGORIES.find(c => c.value === doc.category)?.color}
                      >
                        {CATEGORIES.find(c => c.value === doc.category)?.label}
                      </Badge>
                      {!doc.is_active && (
                        <Badge variant="outline">Đã tắt</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {doc.subcategory && `${doc.subcategory} • `}
                      {doc.content.length} ký tự • 
                      Cập nhật {new Date(doc.updated_at).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(doc)}
                    >
                      {doc.is_active ? <Eye className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(doc)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {doc.tags.length > 0 && (
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {doc.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Alert */}
      <Alert>
        <AlertDescription>
          <strong>Lưu ý:</strong> Sau khi upload tài liệu mới, cần chạy Generate Embeddings 
          để AI có thể tìm kiếm semantic. Embeddings sẽ được tạo tự động trong background.
        </AlertDescription>
      </Alert>
    </div>
  );
}
