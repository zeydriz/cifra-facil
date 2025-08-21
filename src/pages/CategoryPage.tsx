import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HymnCard } from "@/components/HymnCard";
import { useHymns } from "@/hooks/useHymns";
import { useSettings } from "@/hooks/useSettings";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { getHymnsByCategory } = useHymns();
  const { getFontSizeClass } = useSettings();

  const hymns = category ? getHymnsByCategory(category) : [];

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'harpa-crista':
        return {
          name: 'Harpa Cristã',
          description: 'Hinos tradicionais da Harpa Cristã',
          icon: BookOpen
        };
      case 'louvores-gerais':
        return {
          name: 'Louvores Gerais',
          description: 'Cânticos e louvores contemporâneos',
          icon: Music
        };
      default:
        return {
          name: 'Categoria',
          description: 'Hinos da categoria',
          icon: Music
        };
    }
  };

  const categoryInfo = getCategoryInfo(category || '');
  const IconComponent = categoryInfo.icon;

  return (
    <div className={`min-h-screen p-6 ${getFontSizeClass()}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
            <p className="text-muted-foreground">
              {hymns.length} hinos disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {hymns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {hymns.map((hymn) => (
            <HymnCard 
              key={hymn.id} 
              hymn={hymn} 
              onEdit={(id) => navigate(`/edit/${id}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Nenhum hino encontrado</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Esta categoria ainda não possui hinos cadastrados.
          </p>
        </div>
      )}
    </div>
  );
}