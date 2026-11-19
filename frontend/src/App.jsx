
import {  useRef, useState } from 'react'
import {
  Upload, Camera, FileCheck2, LoaderCircle, CheckCircle2,
  AlertTriangle, XCircle, Copy, RefreshCw,
  FileJson, ShieldCheck, UserRound, Settings2, ClipboardCheck
} from 'lucide-react'

const API_URL = '/api/validar-documento-api'
const MAX_SIZE = 8 * 1024 * 1024
const CAMPOS_MATRICULA = [
  ['tipo_documento', 'Tipo de documento'],
  ['pais_emisor', 'País emisor'],
  ['numero_documento', 'Número de documento'],
  ['identificador_personal', 'Identificador personal (si corresponde)'],
  ['numero_soporte', 'Número de soporte (si corresponde)'],
  ['nombre', 'Nombre'],
  ['apellidos', 'Apellidos'],
  ['fecha_nacimiento', 'Fecha de nacimiento'],
  ['fecha_caducidad', 'Fecha de caducidad (informativa)'],
  ['nacionalidad', 'Nacionalidad'],
]


function App() {
  const inputRef = useRef(null)
  const camaraRef = useRef(null)
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mostrarJson, setMostrarJson] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [formulario, setFormulario] = useState(null)
  const [modo, setModo] = useState('alumno')
  const [confirmado, setConfirmado] = useState(false)

  function seleccionarArchivo(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFormulario(null)
    setConfirmado(false)
    if (inputRef.current) inputRef.current.value = ''
    if (camaraRef.current) camaraRef.current.value = ''

    setError('')
    setResultado(null)
    setMostrarJson(false)

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
    setFormulario(null)
    setConfirmado(false)

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
      // Los datos extraídos son una propuesta editable, no una matrícula confirmada.
      if (datos.estado === 'PENDIENTE_VERIFICACION' && datos.datos_extraidos) {
        const inicial = {}
        for (const [campo] of CAMPOS_MATRICULA) {
          inicial[campo] = datos.datos_extraidos[campo] ?? ''
        }
        setFormulario(inicial)
      } else {
        setFormulario(null)
      }
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
    setFormulario(null)
    setConfirmado(false)
    setError('')
    setMostrarJson(false)
    setCopiado(false)

    if (inputRef.current) inputRef.current.value = ''
    if (camaraRef.current) camaraRef.current.value = ''
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
  const esTecnico = modo === 'tecnico'

  function confirmarDatos(event) {
    event.preventDefault()
    if (!formulario || !aceptado || cargando) return
    const obligatorios = ['tipo_documento', 'numero_documento', 'nombre', 'apellidos']
    if (obligatorios.some((campo) => !String(formulario[campo] ?? '').trim())) {
      setError('Revisa los campos obligatorios: tipo de documento, número, nombre y apellidos.')
      setConfirmado(false)
      return
    }
    setError('')
    setConfirmado(true)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5">
          <ShieldCheck className="text-teal-400" size={29} />
          <div>
            <h1 className="text-xl font-semibold">
              {esTecnico ? 'Validación documental · Técnico' : 'Datos para tu matrícula'}
            </h1>
            <p className="text-xs text-slate-400">
              {esTecnico ? 'Diagnóstico del análisis mediante IA local' : 'Sube tu documento y revisa los datos obtenidos'}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 p-5 md:py-10">
        <nav aria-label="Modo de visualización" className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2">
          <button type="button" onClick={() => setModo('alumno')} aria-pressed={!esTecnico}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${!esTecnico ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
            <UserRound size={17} /> Modo alumno
          </button>
          <button type="button" onClick={() => setModo('tecnico')} aria-pressed={esTecnico}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${esTecnico ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Settings2 size={17} /> Modo técnico
          </button>
          <span className="text-xs text-slate-400 md:ml-auto">Demo: el modo técnico no tiene control de acceso</span>
        </nav>
        <section className="space-y-2">
          <h2 className="text-2xl font-bold md:text-3xl">
            {esTecnico ? 'Analizar un documento' : 'Completa tus datos más fácilmente'}
          </h2>
          <p className="text-slate-400">
            {esTecnico
              ? 'Sube una fotografía para comprobar su calidad y extraer la información visible.'
              : 'Haz una foto o sube una imagen de tu documento. Los datos aparecerán en un formulario para que puedas revisarlos y corregirlos.'}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-lg font-semibold">
            1. Seleccionar imagen
          </h3>

          <input
            ref={camaraRef}
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            onChange={seleccionarArchivo}
            className="hidden"
            aria-label="Hacer foto del documento"
          />

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

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                disabled={cargando}
                onClick={() => camaraRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400 disabled:opacity-50"
              >
                <Camera size={17} /> Hacer foto
              </button>
              <button
                type="button"
                disabled={cargando}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                <Upload size={17} /> Subir archivo
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              En ordenador, puedes subir una imagen. En móviles compatibles, «Hacer foto» abre la cámara.
            </p>
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
              2. {esTecnico ? 'Resultado del análisis' : 'Resultado de la lectura'}
            </h3>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-wrap items-center gap-3">
                {aceptado ? (
                  <CheckCircle2 className="text-teal-400" />
                ) : (
                  <AlertTriangle className="text-amber-400" />
                )}

                <span className="break-all font-semibold">
                  {esTecnico
                    ? estado
                    : aceptado
                      ? 'Documento leído. Comprueba los datos.'
                      : estado === 'REVISION_MANUAL'
                        ? 'Necesita revisión por parte del centro.'
                        : 'No se ha completado la lectura del documento.'}
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

            {esTecnico && nitidez && (
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

            {esTecnico && datos && (
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

            {formulario && (
              <section className="rounded-2xl border border-teal-900/70 bg-slate-900 p-6" aria-label="Formulario de matrícula">
                <h4 className="mb-2 text-lg font-semibold">3. Comprueba tus datos</h4>
                <p className="mb-5 text-sm text-slate-400">
                  Estos datos los ha leído una IA. Revísalos y corrige los errores antes de utilizarlos en la matrícula.
                </p>
                <form onSubmit={confirmarDatos} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CAMPOS_MATRICULA.map(([campo, etiqueta]) => (
                    <label key={campo} className="block text-sm text-slate-300">
                      <span className="mb-1 block">{etiqueta}</span>
                      <input
                        type="text"
                        name={campo}
                        value={formulario[campo]}
                        onChange={(event) => {
                          setConfirmado(false)
                          setFormulario((actual) => ({
                            ...actual,
                            [campo]: event.target.value,
                          }))
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-teal-400"
                      />
                    </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" disabled={cargando || confirmado}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50">
                      <ClipboardCheck size={19} /> {confirmado ? 'Datos confirmados' : 'Confirmar mis datos'}
                    </button>
                    <p className="text-xs text-slate-400">Obligatorios: tipo, número, nombre y apellidos.</p>
                  </div>
                  {confirmado && (
                    <div role="status" className="rounded-xl border border-teal-700 bg-teal-950/40 p-4">
                      <p className="flex items-center gap-2 font-semibold text-teal-300"><CheckCircle2 size={19} /> Datos confirmados en esta pantalla</p>
                      <p className="mt-2 text-sm text-slate-300">Has confirmado los datos para la demostración. No se ha enviado una matrícula ni guardado tus correcciones.</p>
                    </div>
                  )}
                </form>
                <p className="mt-5 text-sm text-amber-300">
                  Demostración: las correcciones y la confirmación no se envían ni se guardan. El workflow de prueba puede guardar la extracción original.
                </p>
              </section>
            )}

            {esTecnico && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
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
            </div>}
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
