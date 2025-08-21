import { Heart, Music, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hymn } from "@/types/hymn";
import { useHymns } from "@/hooks/useHymns";
import { Link } from "react-router-dom";

interface HymnCardProps {
  hymn: Hymn;
  onEdit?: (id: string) => void;
}

export function HymnCard({ hymn, onEdit }: HymnCardProps) {
  const { toggleFavorite, deleteHymn } = useHymns();

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'harpa-crista': return 'Harpa Cristã';
      case 'louvores-gerais': return 'Louvores Gerais';
      case 'custom': return 'Personalizado';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'harpa-crista': return 'bg-primary/10 text-primary';
      case 'louvores-gerais': return 'bg-secondary/10 text-secondary';
      case 'custom': return 'bg-accent/10 text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja excluir este hino?')) {
      deleteHymn(hymn.id);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(hymn.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit?.(hymn.id);
  };

  return (
    <Card className="musical-card hover:shadow-elevated transition-all duration-300 hover:scale-105 group">
      <Link to={`/hymn/${hymn.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-primary" />
                {hymn.number && (
                  <span className="text-sm text-muted-foreground">#{hymn.number}</span>
                )}
                {hymn.key && (
                  <Badge variant="outline" className="text-xs">
                    {hymn.key}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {hymn.title}
              </h3>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFavorite}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart 
                className={`w-4 h-4 ${hymn.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(hymn.category)}>
              {getCategoryName(hymn.category)}
            </Badge>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {hymn.isCustom && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {hymn.lyrics.split('\n')[0]}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}