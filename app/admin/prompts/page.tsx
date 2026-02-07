'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Copy, CheckCircle, GitBranch, Play } from 'lucide-react';
import { toast } from 'sonner';

interface PromptTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  content: string;
  variables: any[];
  version: number;
  is_active: boolean;
  parent_id: string | null;
  model_config: {
    temperature: number;
    maxTokens: number;
    topP?: number;
  };
  tags: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export default function PromptsAdminPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'custom',
    content: '',
    tags: '',
    temperature: 0.5,
    maxTokens: 4000,
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/admin/prompts');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPrompts(data);
    } catch (error) {
      toast.error('Không thể tải danh sách prompts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      model_config: {
        temperature: formData.temperature,
        maxTokens: formData.maxTokens,
      },
    };

    try {
      const res = await fetch(
        editingPrompt ? `/api/admin/prompts/${editingPrompt.id}` : '/api/admin/prompts',
        {
          method: editingPrompt ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Failed to save');

      toast.success(editingPrompt ? 'Đã cập nhật prompt' : 'Đã tạo prompt mới');
      setIsDialogOpen(false);
      fetchPrompts();
      resetForm();
    } catch (error) {
      toast.error('Không thể lưu prompt');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa prompt này?')) return;

    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Đã xóa prompt');
      fetchPrompts();
    } catch (error) {
      toast.error('Không thể xóa prompt');
      console.error(error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/prompts/${id}/activate`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to activate');
      toast.success('Đã kích hoạt version này');
      fetchPrompts();
    } catch (error) {
      toast.error('Không thể kích hoạt');
      console.error(error);
    }
  };

  const handleCreateVersion = async (basePrompt: PromptTemplate) => {
    setEditingPrompt(null);
    setFormData({
      name: basePrompt.name,
      slug: basePrompt.slug,
      description: basePrompt.description || '',
      type: basePrompt.type,
      content: basePrompt.content,
      tags: basePrompt.tags.join(', '),
      temperature: basePrompt.model_config.temperature,
      maxTokens: basePrompt.model_config.maxTokens,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (prompt: PromptTemplate) => {
    setEditingPrompt(prompt);
    setFormData({
      name: prompt.name,
      slug: prompt.slug,
      description: prompt.description || '',
      type: prompt.type,
      content: prompt.content,
      tags: prompt.tags.join(', '),
      temperature: prompt.model_config.temperature,
      maxTokens: prompt.model_config.maxTokens,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPrompt(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: 'custom',
      content: '',
      tags: '',
      temperature: 0.5,
      maxTokens: 4000,
    });
  };

  const filteredPrompts = selectedType === 'all' 
    ? prompts 
    : prompts.filter(p => p.type === selectedType);

  const promptTypes = ['system', 'medical', 'formatter', 'clinical', 'knowledge', 'treatment', 'custom'];

  if (loading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Prompts AI</h1>
          <p className="text-muted-foreground">Nạp và quản lý prompts cho hệ thống AI</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Prompt Mới
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Lọc theo loại:</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {promptTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground ml-auto">
              {filteredPrompts.length} prompts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map(prompt => (
          <Card key={prompt.id} className={prompt.is_active ? 'border-green-500' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {prompt.name}
                    {prompt.is_active && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    <Badge variant="outline">{prompt.type}</Badge>
                    <Badge variant="secondary">v{prompt.version}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {prompt.description || 'Không có mô tả'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <code className="bg-muted px-2 py-1 rounded">{prompt.slug}</code>
                    <span>•</span>
                    <span>Sử dụng: {prompt.usage_count} lần</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              {prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Config */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Temp:</span> {prompt.model_config.temperature}
                </div>
                <div>
                  <span className="text-muted-foreground">Max tokens:</span> {prompt.model_config.maxTokens}
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs font-mono line-clamp-3">{prompt.content}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!prompt.is_active && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleActivate(prompt.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Kích hoạt
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(prompt)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCreateVersion(prompt)}
                >
                  <GitBranch className="h-4 w-4 mr-1" />
                  Version mới
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDelete(prompt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? 'Chỉnh sửa Prompt' : 'Tạo Prompt Mới'}
            </DialogTitle>
            <DialogDescription>
              Nạp prompt template cho hệ thống AI
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Thông tin</TabsTrigger>
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="config">Cấu hình</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên prompt *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (dùng trong code) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="unified-medical-v2"
                      required
                      disabled={!!editingPrompt}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại prompt</Label>
                    <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {promptTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="medical, mai-hoa, diagnosis"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung prompt *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={20}
                    className="font-mono text-sm"
                    placeholder="Nhập prompt template... 
Có thể dùng variables: {{variable_name}}"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Dùng {`{{variable_name}}`} để define variables
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (0-1)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Thấp = chính xác, Cao = sáng tạo
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      step="100"
                      min="100"
                      max="8000"
                      value={formData.maxTokens}
                      onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Độ dài tối đa output
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {editingPrompt ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
