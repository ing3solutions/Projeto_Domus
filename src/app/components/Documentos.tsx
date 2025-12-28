import { useState } from 'react';
import { Folder, FileText, Upload, Search, ChevronRight, Home, FolderPlus, Download, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { DocumentoUpload } from './DocumentoUpload';

interface Document {
  id: number;
  nome: string;
  tipo: 'pasta' | 'arquivo';
  categoria?: 'atas' | 'contratos' | 'financeiro' | 'legal' | 'outros';
  tamanho?: string;
  data: string;
  visibilidade?: string;
  path: string[];
}

export function Documentos() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  
  const [documentos, setDocumentos] = useState<Document[]>([
    {
      id: 1,
      nome: 'Atas de Assembleias',
      tipo: 'pasta',
      data: '15 Dez 2024',
      path: [],
    },
    {
      id: 2,
      nome: 'Contratos de Prestadores',
      tipo: 'pasta',
      data: '10 Dez 2024',
      path: [],
    },
    {
      id: 3,
      nome: 'Balancetes',
      tipo: 'pasta',
      data: '01 Dez 2024',
      path: [],
    },
    {
      id: 4,
      nome: 'Regimento Interno',
      tipo: 'pasta',
      data: '20 Nov 2024',
      path: [],
    },
    {
      id: 5,
      nome: 'AVCB_2024.pdf',
      tipo: 'arquivo',
      categoria: 'legal',
      tamanho: '2.4 MB',
      data: '28 Dez 2024',
      visibilidade: 'Todos',
      path: [],
    },
    {
      id: 6,
      nome: 'Seguro_Predial.pdf',
      tipo: 'arquivo',
      categoria: 'contratos',
      tamanho: '1.8 MB',
      data: '20 Dez 2024',
      visibilidade: 'Administração',
      path: [],
    },
  ]);

  const currentDocuments = documentos.filter(
    doc => JSON.stringify(doc.path) === JSON.stringify(currentPath)
  );

  const handleNavigate = (folder: Document) => {
    if (folder.tipo === 'pasta') {
      setCurrentPath([...currentPath, folder.nome]);
    }
  };

  const handleBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const handleNewFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: Document = {
      id: Date.now(),
      nome: newFolderName,
      tipo: 'pasta',
      data: new Date().toLocaleDateString('pt-BR'),
      path: currentPath,
    };

    setDocumentos([...documentos, newFolder]);
    setNewFolderName('');
    setShowNewFolder(false);
  };

  const handleUpload = (form: any) => {
    const newDoc: Document = {
      id: Date.now(),
      nome: form.nome,
      tipo: 'arquivo',
      categoria: form.categoria,
      tamanho: form.arquivo ? (form.arquivo.size / (1024 * 1024)).toFixed(1) + ' MB' : '0 MB',
      data: new Date().toLocaleDateString('pt-BR'),
      visibilidade: form.visibilidade,
      path: currentPath,
    };

    setDocumentos([...documentos, newDoc]);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja mover este item para a lixeira?')) {
      setDocumentos(documentos.filter(doc => doc.id !== id));
      setShowMenu(null);
    }
  };

  const getCategoriaColor = (categoria?: string) => {
    switch (categoria) {
      case 'atas':
        return 'bg-[#588157]/10 text-[#588157]';
      case 'contratos':
        return 'bg-[#FACC15]/10 text-[#FACC15]';
      case 'financeiro':
        return 'bg-[#22C55E]/10 text-[#22C55E]';
      case 'legal':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      default:
        return 'bg-[#64748B]/10 text-[#64748B]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">Documentos</h2>
          <p className="text-sm text-[#64748B] mt-1">Organize e acesse documentos importantes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewFolder(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#DAD7CD] text-[#0F172A] rounded-lg hover:bg-[#A3B18A] transition-colors"
          >
            <FolderPlus className="w-5 h-5" />
            Nova Pasta
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-sm"
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#DAD7CD] rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm overflow-x-auto">
          <button
            onClick={() => handleBreadcrumb(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors text-[#0F172A]"
          >
            <Home className="w-4 h-4" />
            Documentos
          </button>
          {currentPath.map((folder, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
              <button
                onClick={() => handleBreadcrumb(index)}
                className="px-3 py-1.5 rounded-lg hover:bg-white/50 transition-colors text-[#0F172A] whitespace-nowrap"
              >
                {folder}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Buscar documentos..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent transition-all"
        />
      </div>

      {/* Grid de Documentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#DAD7CD] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group relative"
          >
            <div
              className="flex flex-col items-center text-center"
              onClick={() => handleNavigate(doc)}
            >
              {/* Ícone */}
              <div className="w-16 h-16 rounded-xl bg-[#588157]/10 flex items-center justify-center mb-4 group-hover:bg-[#588157]/20 transition-colors">
                {doc.tipo === 'pasta' ? (
                  <Folder className="w-8 h-8 text-[#588157]" />
                ) : (
                  <FileText className="w-8 h-8 text-[#588157]" />
                )}
              </div>

              {/* Nome */}
              <h3 className="font-medium text-[#0F172A] mb-2 line-clamp-2 w-full">
                {doc.nome}
              </h3>

              {/* Categoria (arquivos) */}
              {doc.tipo === 'arquivo' && doc.categoria && (
                <span className={`text-xs px-2 py-1 rounded-full mb-2 ${getCategoriaColor(doc.categoria)}`}>
                  {doc.categoria}
                </span>
              )}

              {/* Metadados */}
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span>{doc.data}</span>
                {doc.tamanho && (
                  <>
                    <span>•</span>
                    <span>{doc.tamanho}</span>
                  </>
                )}
              </div>

              {doc.visibilidade && (
                <div className="mt-2 text-xs text-[#64748B]">
                  🔒 {doc.visibilidade}
                </div>
              )}
            </div>

            {/* Menu de Ações */}
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(showMenu === doc.id ? null : doc.id);
                }}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-[#64748B]" />
              </button>

              {showMenu === doc.id && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#A3B18A]/20 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Visualizar: ' + doc.nome);
                      setShowMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#DAD7CD]/50 transition-colors rounded-t-lg"
                  >
                    {doc.tipo === 'arquivo' && <Download className="w-4 h-4" />}
                    {doc.tipo === 'arquivo' ? 'Download' : 'Abrir'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Renomear: ' + doc.nome);
                      setShowMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#DAD7CD]/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Renomear
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentDocuments.length === 0 && (
        <div className="bg-[#DAD7CD] rounded-xl p-12 text-center">
          <Folder className="w-16 h-16 text-[#A3B18A] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Pasta vazia</h3>
          <p className="text-sm text-[#64748B]">
            Comece fazendo upload de documentos ou criando novas pastas
          </p>
        </div>
      )}

      {/* Dica */}
      <div className="bg-[#588157]/10 border border-[#588157]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#588157] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-[#0F172A] mb-1">Organize seus documentos</h4>
            <p className="text-sm text-[#64748B]">
              Mantenha todos os arquivos importantes do condomínio em um só lugar, 
              organizados e de fácil acesso. Os documentos são armazenados com segurança.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpload && (
        <DocumentoUpload
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          currentPath={currentPath}
        />
      )}

      {showNewFolder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#DAD7CD] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Nova Pasta</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNewFolder()}
              placeholder="Nome da pasta"
              autoFocus
              className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName('');
                }}
                className="flex-1 px-4 py-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors text-[#0F172A]"
              >
                Cancelar
              </button>
              <button
                onClick={handleNewFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
