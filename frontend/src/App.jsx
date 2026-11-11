
import {  useRef, useState } from 'react'
import {
  Upload, FileCheck2, LoaderCircle, CheckCircle2,
  AlertTriangle, XCircle, Copy, RefreshCw,
  FileJson, ShieldCheck
} from 'lucide-react'

const API_URL = '/api/validar-documento-api'
const MAX_SIZE = 8 * 1024 * 1024

function App() {
  const inputRef = useRef(null)
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarJson, setMostrarJson] = useState(false)
  const [copiado, setCopiado] = useState(false)

  /*
  useEffect(() => {
    if (!archivo) {
      return
    }

    const url = URL.createObjectURL(archivo)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [archivo])
*/
  function seleccionarArchivo(event) {
    if (preview) URL.revokeObjectURL(preview)
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setResultado(null)
    setMostrarJson(false)
    //setPreview(null)

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setArchivo(null)
      setError('Solo se permiten imágenes JPG o PNG.')
      return
    }

    if (file.size > MAX_SIZE) {
      setArchivo(null)
      setError('La imagen supera el máximo de 8 MiB.')
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    setArchivo(file)
  }

  async function analizar() {
    if (!archivo || cargando) return

    setCargando(true)
    setError('')
    setResultado(null)

    const formData = new FormData()
    formData.append('imagen', archivo)

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!respuesta.ok) {
        throw new Error(
          `La API devolvió un error HTTP ${respuesta.status}`
        )
      }

      const datos = await respuesta.json()

      if (
        !datos ||
        typeof datos !== 'object' ||
        typeof datos.estado !== 'string' ||
        typeof datos.ok !== 'boolean'
      ) {
        throw new Error('La API devolvió un JSON inesperado.')
      }

      setResultado(datos)
    } catch (err) {
      setError(err.message || 'No se pudo analizar la imagen.')
    } finally {
      setCargando(false)
    }
  }

  function reiniciar() {
    
    setArchivo(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setResultado(null)
    setError('')
    setMostrarJson(false)
    setCopiado(false)

    if (inputRef.current) inputRef.current.value = ''
  }

  async function copiarJson() {
    if (!resultado) return

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(resultado, null, 2)
      )
      setCopiado(true)
    } catch {
      setError('No se pudo copiar el JSON.')
    }
  }

  const estado = resultado?.estado
  const aceptado = estado === 'PENDIENTE_VERIFICACION'
  const datos = resultado?.datos_extraidos
  const nitidez = resultado?.nitidez

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5">
          <ShieldCheck className="text-teal-400" size={29} />
          <div>
            <h1 className="text-xl font-semibold">
              Validación documental
            </h1>
            <p className="text-xs text-slate-400">
              Plataforma de análisis mediante IA local
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 p-5 md:py-10">
        <section className="space-y-2">
          <h2 className="text-2xl font-bold md:text-3xl">
            Analizar un documento
          </h2>
          <p className="text-slate-400">
            Sube una fotografía para comprobar su calidad
            y extraer la información visible.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-lg font-semibold">
            1. Seleccionar imagen
          </h3>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={seleccionarArchivo}
            className="hidden"
            id="documento"
          />

          <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-7 text-center">
            {preview ? (
              <img
                src={preview}
                alt="Vista previa del documento seleccionado"
                className="mx-auto max-h-72 rounded-lg object-contain"
              />
            ) : (
              <Upload
                size={44}
                className="mx-auto text-slate-500"
              />
            )}

            <p className="mt-4 break-all font-medium">
              {archivo?.name ?? 'Ningún archivo seleccionado'}
            </p>

            <p className="mt-2 text-sm text-slate-400">
              JPG o PNG · Máximo 8 MiB
            </p>

            <button
              type="button"
              disabled={cargando}
              onClick={() => inputRef.current?.click()}
              className="mt-5 rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              Elegir archivo
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={analizar}
              disabled={!archivo || cargando}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {cargando ? (
                <LoaderCircle className="animate-spin" size={19} />
              ) : (
                <FileCheck2 size={19} />
              )}
              {cargando ? 'Analizando...' : 'Analizar documento'}
            </button>

            <button
              type="button"
              disabled={cargando}
              onClick={reiniciar}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 hover:bg-slate-800 disabled:opacity-40"
            >
              <RefreshCw size={17} />
              Limpiar
            </button>
          </div>
        </section>

        {error && (
          <div role="alert" className="flex gap-3 rounded-xl border border-red-900 bg-red-950/40 p-5 text-red-200">
            <XCircle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {cargando && (
          <div role="status" className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
            <LoaderCircle className="mx-auto mb-3 animate-spin text-teal-400" size={30} />
            <p className="font-medium">Procesando documento...</p>
            <p className="mt-2 text-sm text-slate-400">
              Qwen3-VL está analizando la imagen.
            </p>
          </div>
        )}

        {resultado && (
          <section className="space-y-5" aria-label="Resultado del análisis">
            <h3 className="text-xl font-semibold">
              2. Resultado del análisis
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-wrap items-center gap-3">
                {aceptado ? (
                  <CheckCircle2 className="text-teal-400" />
                ) : (
                  <AlertTriangle className="text-amber-400" />
                )}

                <span className="break-all font-semibold">
                  {estado}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                {resultado.motivo ?? 'Sin motivo disponible'}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                El análisis automático no verifica la autenticidad
                del documento ni la identidad de su titular.
              </p>
            </div>

            {nitidez && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h4 className="mb-4 font-semibold">
                  Análisis de nitidez
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Dato titulo="Estado" valor={nitidez.estado} />
                  <Dato titulo="Varianza" valor={nitidez.varianza} />
                  <Dato titulo="Umbral" valor={nitidez.umbral} />
                </div>
              </div>
            )}

            {datos && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h4 className="mb-4 font-semibold">
                  Datos extraídos
                </h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(datos).map(([clave, valor]) => (
                    <Dato
                      key={clave}
                      titulo={clave.replaceAll('_', ' ')}
                      valor={valor}
                    />
                  ))}
                </div>

                <p className="mt-5 text-xs text-amber-300">
                  Comprueba los datos antes de utilizarlos
                  en un registro de alumnos.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <FileJson size={20} className="text-teal-400" />
                  JSON de respuesta
                </h4>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMostrarJson(!mostrarJson)}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                  >
                    {mostrarJson ? 'Ocultar' : 'Ver JSON'}
                  </button>

                  <button
                    type="button"
                    onClick={copiarJson}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                  >
                    <Copy size={15} />
                    {copiado ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              {mostrarJson && (
                <pre className="mt-5 max-h-96 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-teal-200">
                  {JSON.stringify(resultado, null, 2)}
                </pre>
              )}
            </div>
          </section>
        )}

        <footer className="pt-5 text-center text-xs text-slate-500">
          React · n8n · Ollama · Qwen3-VL · Sharp
        </footer>
      </div>
    </main>
  )
}

function Dato({ titulo, valor }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-950/70 p-4">
      <p className="mb-1 text-xs capitalize text-slate-400">
        {titulo}
      </p>
      <p className="break-words font-medium">
        {valor === null || valor === undefined || valor === ''
          ? 'No disponible'
          : String(valor)}
      </p>
    </div>
  )
}

export default App
