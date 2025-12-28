import { useState } from 'react';
import { X, Upload, File, Folder, Download, Edit2, Trash2, FolderPlus } from 'lucide-react';

interface DocumentoUploadProps {
  onClose: () => void;
  onUpload: (documento: DocumentoForm) => void;
  currentPath: string[];
}

interface DocumentoForm {
  nome: string;
  categoria: 'atas' | 'contratos' | 'financeiro' | 'legal' | 'outros';
  visibilidade: 'administracao' | 'sindico' | 'todos';
  observacoes: string;
  arquivo?: File;
}

export function DocumentoUpload({ onClose, onUpload, currentPath }: DocumentoUploadProps) {
  const [formData, setFormData] = useState<DocumentoForm>({
    nome: '',
    categoria: 'outros',
    visibilidade: 'administracao',
    observacoes: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFormData({ ...formData, arquivo: file, nome: file.name });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!formData.arquivo || !formData.nome) return;

    setIsUploading(true);
    // Simulação de upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUpload(formData);
          onClose();
        }, 300);
      }
    }, 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-[#3A5A40] rounded-t-2xl p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Upload de Documento</h2>
              <p className="text-sm text-white/70 mt-1">
                {currentPath.length > 0 ? currentPath.join(' / ') : 'Raiz'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all
              ${dragActive
                ? 'border-[#588157] bg-[#588157]/5'
                : 'border-[#A3B18A] bg-[#DAD7CD]/50'
              }
            `}
          >
            {formData.arquivo ? (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-xl bg-[#588157]/10 flex items-center justify-center mx-auto">
                  <File className="w-8 h-8 text-[#588157]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A]">{formData.arquivo.name}</p>
                  <p className="text-sm text-[#64748B]">
                    {formatFileSize(formData.arquivo.size)}
                  </p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, arquivo: undefined, nome: '' })}
                  className="text-sm text-[#EF4444] hover:text-[#DC2626]"
                >
                  Remover arquivo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-xl bg-[#588157]/10 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-[#588157]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F172A] mb-1">
                    Arraste o arquivo aqui ou clique para selecionar
                  </p>
                  <p className="text-sm text-[#64748B]">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (máx. 50MB)
                  </p>
                </div>
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors cursor-pointer"
                >
                  Selecionar Arquivo
                </label>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Nome do Documento */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Nome do Documento *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Ata da Assembleia Dezembro 2024"
                className="w-full px-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157]"
                >
                  <option value="atas">Atas</option>
                  <option value="contratos">Contratos</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="legal">Legal</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Visibilidade */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Visibilidade *
                </label>
                <select
                  value={formData.visibilidade}
                  onChange={(e) => setFormData({ ...formData, visibilidade: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157]"
                >
                  <option value="administracao">Apenas Administração</option>
                  <option value="sindico">Síndico e Administração</option>
                  <option value="todos">Todos os Moradores</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                placeholder="Informações adicionais sobre o documento..."
                className="w-full px-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] resize-none"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#0F172A]">Enviando arquivo...</span>
                <span className="text-[#64748B]">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-[#A3B18A]/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#588157] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#A3B18A]/30">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 bg-[#DAD7CD] rounded-lg hover:bg-[#A3B18A] transition-colors text-[#0F172A] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.arquivo || !formData.nome || isUploading}
              className="flex-1 px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Enviando...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
