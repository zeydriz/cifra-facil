import { useState } from "react";
import { Search, Music, Heart, BookOpen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HymnCard } from "@/components/HymnCard";
import { useHymns } from "@/hooks/useHymns";
import { useSettings } from "@/hooks/useSettings";
import { Link, useNavigate } from "react-router-dom";
import { HymnCategory } from "@/types/hymn";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { hymns, getHymnsByCategory, getFavoriteHymns, searchHymns } = useHymns();
  const { getFontSizeClass } = useSettings();
  const navigate = useNavigate();

  const categories: HymnCategory[] = [
    {
      id: 'harpa-crista',
      name: 'Harpa Cristã',
      description: 'Hinos tradicionais da Harpa Cristã',
      icon: 'BookOpen',
      count: getHymnsByCategory('harpa-crista').length
    },
    {
      id: 'louvores-gerais',
      name: 'Louvores Gerais',
      description: 'Cânticos e louvores contemporâneos',
      icon: 'Music',
      count: getHymnsByCategory('louvores-gerais').length
    },
    {
      id: 'favorites',
      name: 'Favoritos',
      description: 'Seus hinos preferidos',
      icon: 'Heart',
      count: getFavoriteHymns().length
    }
  ];

  const recentHymns = hymns.slice(-6).reverse();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchHymns(query);
      setSearchResults(results as any[]);
    } else {
      setSearchResults([]);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'favorites') {
      navigate('/favorites');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'Music': return Music;
      case 'Heart': return Heart;
      default: return Music;
    }
  };

  return (
    <div className={`min-h-screen p-6 space-y-8 ${getFontSizeClass()}`}>
      {/* Hero Section */}
      <div className="bg-gradient-musical rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Bem-vindo ao Cifraino
          </h1>
          <p className="text-xl mb-6 text-white/90 animate-slide-up">
            Sua coleção completa de hinos e louvores com cifras
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <Input
              placeholder="Buscar hinos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Resultados da Busca</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((hymn: any) => (
            <HymnCard 
              key={hymn.id} 
              hymn={hymn} 
              onEdit={(id) => navigate(`/edit/${id}`)} 
            />
          ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!searchQuery && (
        <>
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Categorias</h2>
              <Link to="/add">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Hino
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <Card 
                    key={category.id}
                    className="musical-card hover:shadow-elevated transition-all duration-300 hover:scale-105 cursor-pointer group"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.count} hinos
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Hymns */}
          {recentHymns.length > 0 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Adicionados Recentemente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentHymns.map((hymn) => (
                  <HymnCard 
                    key={hymn.id} 
                    hymn={hymn} 
                    onEdit={(id) => navigate(`/edit/${id}`)} 
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}