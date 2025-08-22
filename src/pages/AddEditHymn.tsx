import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHymns } from "@/hooks/useHymns";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "@/hooks/use-toast";
import { Hymn } from "@/types/hymn";

export default function AddEditHymn() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hymns, addHymn, updateHymn } = useHymns();
  const { getFontSizeClass } = useSettings();
  
  const isEditing = Boolean(id);
  const existingHymn = isEditing ? hymns.find(h => h.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    number: '',
    category: 'custom',
    key: '',
    lyrics: '',
    chords: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [newKey, setNewKey] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewKeyInput, setShowNewKeyInput] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingHymn) {
      setFormData({
        title: existingHymn.title,
        number: existingHymn.number?.toString() || '',
        category: existingHymn.category,
        key: existingHymn.key || '',
        lyrics: existingHymn.lyrics,
        chords: existingHymn.chords || ''
      });
    }
  }, [existingHymn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.lyrics.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e letra são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const hymnData: Omit<Hymn, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        number: formData.number ? parseInt(formData.number) : undefined,
        category: formData.category,
        key: formData.key.trim() || undefined,
        lyrics: formData.lyrics.trim(),
        chords: formData.chords.trim() || undefined,
        isFavorite: existingHymn?.isFavorite || false,
        isCustom: true
      };

      if (isEditing && existingHymn) {
        updateHymn(existingHymn.id, hymnData);
        toast({
          title: "Hino atualizado!",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        const newHymn = addHymn(hymnData);
        toast({
          title: "Hino adicionado!",
          description: "O hino foi criado com sucesso.",
        });
        navigate(`/hymn/${newHymn.id}`);
        return;
      }

      navigate(`/hymn/${existingHymn.id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o hino. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const categories = [
    { value: 'custom', label: 'Personalizado' },
    { value: 'harpa-crista', label: 'Harpa Cristã' },
    { value: 'louvores-gerais', label: 'Louvores Gerais' }
  ];

  const handleCategoryChange = (value: string) => {
    if (value === 'novo') {
      setShowNewCategoryInput(true);
      setNewCategory('');
    } else {
      setShowNewCategoryInput(false);
      handleInputChange('category', value);
    }
  };

  const handleKeyChange = (value: string) => {
    if (value === 'novo') {
      setShowNewKeyInput(true);
      setNewKey('');
    } else {
      setShowNewKeyInput(false);
      handleInputChange('key', value);
    }
  };

  const handleNewCategoryConfirm = () => {
    if (newCategory.trim()) {
      handleInputChange('category', newCategory.trim());
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };

  const handleNewKeyConfirm = () => {
    if (newKey.trim()) {
      handleInputChange('key', newKey.trim());
      setShowNewKeyInput(false);
      setNewKey('');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${getFontSizeClass()}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Hino' : 'Adicionar Novo Hino'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifique as informações do hino' : 'Crie um novo hino personalizado'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="musical-card max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Informações do Hino
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Nome do hino"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  type="number"
                  placeholder="Ex: 123"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                {showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da nova categoria"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewCategoryConfirm()}
                    />
                    <Button type="button" size="sm" onClick={handleNewCategoryConfirm}>
                      OK
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowNewCategoryInput(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                      <SelectItem value="novo">+ Criar nova categoria</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Tom</Label>
                {showNewKeyInput ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o novo tom (ex: C#m, F7, etc.)"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewKeyConfirm()}
                    />
                    <Button type="button" size="sm" onClick={handleNewKeyConfirm}>
                      OK
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowNewKeyInput(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Select 
                    value={formData.key} 
                    onValueChange={handleKeyChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      {keys.map(key => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                      <SelectItem value="novo">+ Criar novo tom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Lyrics */}
            <div className="space-y-2">
              <Label htmlFor="lyrics">Letra *</Label>
              <Textarea
                id="lyrics"
                placeholder="Digite a letra do hino..."
                rows={10}
                value={formData.lyrics}
                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                className="resize-none"
                required
              />
            </div>

            {/* Chords */}
            <div className="space-y-2">
              <Label htmlFor="chords">Cifras</Label>
              <Textarea
                id="chords"
                placeholder="Digite as cifras do hino (uma linha de cifra seguida da letra correspondente)..."
                rows={10}
                value={formData.chords}
                onChange={(e) => handleInputChange('chords', e.target.value)}
                className="resize-none chord-text"
              />
              <p className="text-sm text-muted-foreground">
                Dica: Digite as cifras em linhas separadas, alinhadas com a letra correspondente.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Hino')}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}