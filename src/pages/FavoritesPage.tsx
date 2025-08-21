import { Heart } from "lucide-react";
import { HymnCard } from "@/components/HymnCard";
import { useHymns } from "@/hooks/useHymns";
import { useSettings } from "@/hooks/useSettings";
import { useNavigate } from "react-router-dom";

export default function FavoritesPage() {
  const { getFavoriteHymns } = useHymns();
  const { getFontSizeClass } = useSettings();
  const navigate = useNavigate();
  
  const favoriteHymns = getFavoriteHymns();

  return (
    <div className={`min-h-screen p-6 ${getFontSizeClass()}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Favoritos</h1>
            <p className="text-muted-foreground">
              {favoriteHymns.length} hinos favoritados
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {favoriteHymns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {favoriteHymns.map((hymn) => (
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
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Nenhum favorito ainda</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Comece favoritando alguns hinos para ter acesso rápido aos seus preferidos.
          </p>
        </div>
      )}
    </div>
  );
}