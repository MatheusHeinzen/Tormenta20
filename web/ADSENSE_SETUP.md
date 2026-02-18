# Configuração do Google AdSense

Este projeto está configurado para exibir anúncios do Google AdSense de forma otimizada e não intrusiva.

## Configuração

### 1. Obter credenciais do AdSense

1. Acesse o [Google AdSense](https://www.google.com/adsense/)
2. Crie uma conta ou faça login
3. Obtenha seu **Publisher ID** (formato: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Crie unidades de anúncios no painel do AdSense e obtenha os **Ad Unit IDs**

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto `web/` com as seguintes variáveis:

```env
# Google AdSense Publisher ID (obrigatório)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Ad Unit ID padrão para banners horizontais
NEXT_PUBLIC_ADSENSE_AD_UNIT_ID=1234567890

# Ad Unit IDs para sidebars (recomendado criar unidades separadas)
NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID=1234567891
NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID_2=1234567892
```

**Importante:** 
- Substitua `ca-pub-XXXXXXXXXXXXXXXX` pelo seu Publisher ID real
- Substitua `1234567890` pelo seu Ad Unit ID real
- O arquivo `.env.local` não deve ser commitado no git (já está no .gitignore)

### 3. Criar unidades de anúncios no AdSense

Recomenda-se criar diferentes unidades de anúncios para diferentes posições:

- **Banner horizontal** (topo/rodapé): Formato responsivo ou 728x90
- **Banner entre conteúdo**: Formato responsivo
- **Sidebar** (se usar): Formato vertical 300x250

## Estrutura de Anúncios Implementada

### Homepage (`/`)
- Banner horizontal após o header
- Banner horizontal antes do rodapé

### Lista de Fichas (`/sheets`)
- **Mobile**: Banner horizontal após o header e antes do rodapé
- **Desktop (lg+)**: Sidebar fixa com 2 anúncios verticais (sticky)
- Banner a cada 3 fichas na lista (apenas mobile)

### Página de Edição (`/sheets/[id]/edit`)
- **Desktop (lg+)**: Sidebar fixa com 2 anúncios verticais (sticky)
- Layout responsivo: sidebar aparece apenas em telas grandes (≥1024px)

### Página de Jogo (`/sheets/[id]/play`)
- **Desktop (lg+)**: Sidebar fixa com 2 anúncios verticais (sticky)
- Layout responsivo: sidebar aparece apenas em telas grandes (≥1024px)

## Componentes Disponíveis

### `AdSense`
Componente base para exibir anúncios do AdSense.

```tsx
import { AdSense } from '@/components/ads/AdSense';

<AdSense 
  adUnitId="1234567890"  // Opcional se NEXT_PUBLIC_ADSENSE_AD_UNIT_ID estiver configurado
  format="auto"
  className="my-4"
/>
```

### `AdBanner`
Componente pré-configurado para banners horizontais.

```tsx
import { AdBanner } from '@/components/ads/AdBanner';

<AdBanner 
  position="top"  // 'top' | 'bottom' | 'middle' | 'sidebar'
  adUnitId="1234567890"  // Opcional
/>
```

### `AdSidebar`
Componente para anúncios verticais (sidebar).

```tsx
import { AdSidebar } from '@/components/ads/AdSidebar';

<AdSidebar adUnitId="1234567890" />
```

## Otimizações Implementadas

1. **Carregamento assíncrono**: Scripts do AdSense são carregados de forma assíncrona para não bloquear a renderização
2. **Lazy loading**: Scripts são carregados apenas quando necessário
3. **Placeholders em desenvolvimento**: Em modo de desenvolvimento, placeholders são exibidos quando as credenciais não estão configuradas
4. **Posicionamento estratégico**: Anúncios posicionados em locais de alta visibilidade sem prejudicar a experiência do usuário
5. **Responsivo**: Todos os anúncios são configurados para serem responsivos

## Boas Práticas

- ✅ Não exceder 3 anúncios por página
- ✅ Posicionar anúncios em locais naturais do conteúdo
- ✅ Manter espaçamento adequado entre anúncios e conteúdo
- ✅ Usar formatos responsivos para melhor performance
- ✅ Testar em diferentes tamanhos de tela

## Troubleshooting

### Anúncios não aparecem
1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Certifique-se de que o site está aprovado no AdSense
3. Verifique o console do navegador para erros
4. Em desenvolvimento, os placeholders devem aparecer se as credenciais não estiverem configuradas

### Erro "adsbygoogle.push()"
- Isso é normal durante o desenvolvimento se o AdSense ainda não foi configurado
- O erro será ignorado silenciosamente em produção quando o script estiver carregado corretamente

## Notas Importantes

- ⚠️ O AdSense pode levar alguns dias para aprovar seu site
- ⚠️ Durante o período de aprovação, anúncios podem não aparecer
- ⚠️ Não clique nos seus próprios anúncios (viola as políticas do AdSense)
- ⚠️ Em produção, certifique-se de que as variáveis de ambiente estão configuradas no seu provedor de hospedagem (Vercel, Netlify, etc.)
