import { Settings, Palette, Type, Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const { settings, updateTheme, updateFontSize, getFontSizeClass } = useSettings();

  const fontSizeOptions = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
    { value: 'extra-large', label: 'Extra Grande' }
  ];

  return (
    <div className={`min-h-screen p-6 ${getFontSizeClass()}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Personalize sua experiência no Cifraino
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Theme Settings */}
        <Card className="musical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Tema</Label>
              <div className="flex gap-3">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => updateTheme('light')}
                  className="flex-1 gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Claro
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => updateTheme('dark')}
                  className="flex-1 gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Escuro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Settings */}
        <Card className="musical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Tipografia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="fontSize">Tamanho da Fonte</Label>
              <Select value={settings.fontSize} onValueChange={updateFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              <Label>Prévia</Label>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Exemplo de Título</h3>
                <p className="text-muted-foreground">
                  Este é um exemplo de como o texto aparecerá com o tamanho selecionado.
                </p>
                <div className="chord-text text-primary">
                  C       F       G       C
                </div>
                <p>Esta é uma linha de letra do hino</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="musical-card">
          <CardHeader>
            <CardTitle>Sobre o Cifraino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-musical rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cifraino</h3>
              <p className="text-muted-foreground">
                Sua coleção completa de hinos e louvores com cifras
              </p>
            </div>
            
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Versão 1.0.0</p>
              <p>
                Desenvolvido com ❤️ para a comunidade cristã
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}