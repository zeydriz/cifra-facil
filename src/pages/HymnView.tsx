import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Heart, Edit, Music, Key, Type, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHymns } from "@/hooks/useHymns";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "@/hooks/use-toast";

export default function HymnView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hymns, toggleFavorite } = useHymns();
  const { getFontSizeClass } = useSettings();
  const [showChords, setShowChords] = useState(true);

  const hymn = hymns.find(h => h.id === id);

  if (!hymn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hino não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFavorite = () => {
    toggleFavorite(hymn.id);
    toast({
      title: hymn.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: hymn.title,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hymn.title,
          text: `Confira este hino: ${hymn.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do hino foi copiado para a área de transferência.",
      });
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'harpa-crista': return 'Harpa Cristã';
      case 'louvores-gerais': return 'Louvores Gerais';
      case 'custom': return 'Personalizado';
      default: return category;
    }
  };

  const formatLyricsWithChords = (lyrics: string, chords?: string) => {
    if (!chords || !showChords) {
      return lyrics.split('\n').map((line, index) => (
        <div key={index} className="mb-2">
          {line || '\u00A0'}
        </div>
      ));
    }

    const lyricsLines = lyrics.split('\n');
    const chordsLines = chords.split('\n');
    const result = [];

    for (let i = 0; i < Math.max(lyricsLines.length, chordsLines.length); i++) {
      const chordLine = chordsLines[i];
      const lyricLine = lyricsLines[i];

      if (chordLine && chordLine.trim()) {
        result.push(
          <div key={`chord-${i}`} className="chord-text text-primary font-semibold mb-1">
            {chordLine}
          </div>
        );
      }

      if (lyricLine !== undefined) {
        result.push(
          <div key={`lyric-${i}`} className="mb-2">
            {lyricLine || '\u00A0'}
          </div>
        );
      }
    }

    return result;
  };

  return (
    <div className={`min-h-screen p-6 ${getFontSizeClass()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant={hymn.isFavorite ? "default" : "outline"} 
            onClick={handleFavorite}
            size="sm"
          >
            <Heart className={`w-4 h-4 ${hymn.isFavorite ? 'fill-current' : ''}`} />
          </Button>
          {hymn.isCustom && (
            <Link to={`/edit/${hymn.id}`}>
              <Button size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Hymn Info */}
      <Card className="musical-card mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Music className="w-6 h-6 text-primary" />
                {hymn.number && (
                  <Badge variant="outline">#{hymn.number}</Badge>
                )}
                <Badge className="bg-primary/10 text-primary">
                  {getCategoryName(hymn.category)}
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-2">{hymn.title}</CardTitle>
              {hymn.key && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Key className="w-4 h-4" />
                  <span>Tom: {hymn.key}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      <Card className="musical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Letra e Cifras
            </CardTitle>
            
            {hymn.chords && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChords(!showChords)}
              >
                {showChords ? 'Ocultar Cifras' : 'Mostrar Cifras'}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="formatted" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="formatted">Formatado</TabsTrigger>
              <TabsTrigger value="plain">Texto Simples</TabsTrigger>
            </TabsList>

            <TabsContent value="formatted" className="mt-6">
              <div className="bg-muted/30 rounded-lg p-6 leading-relaxed whitespace-pre-wrap custom-scrollbar max-h-96 overflow-y-auto">
                {formatLyricsWithChords(hymn.lyrics, hymn.chords)}
              </div>
            </TabsContent>

            <TabsContent value="plain" className="mt-6">
              <div className="bg-muted/30 rounded-lg p-6 leading-relaxed whitespace-pre-wrap custom-scrollbar max-h-96 overflow-y-auto">
                {hymn.lyrics}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}