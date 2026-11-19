
FROM n8nio/runners:2.44.4

USER root

# Instalar Sharp de forma aislada.
# NO modificar las dependencias originales de n8n.
RUN mkdir -p /opt/n8n-sharp \
    && cd /opt/n8n-sharp \
    && printf '{"name":"n8n-sharp-addon","version":"1.0.0","private":true}\n' > package.json \
    && pnpm add sharp@0.34.4 --allow-build=sharp

# Hacer Sharp accesible al ejecutor JavaScript.
RUN ln -s /opt/n8n-sharp/node_modules/sharp \
    /opt/runners/task-runner-javascript/node_modules/sharp

# Permitir que los nodos Code importen Sharp.
RUN node -e "const fs=require('fs'); \
const p='/etc/n8n-task-runners.json'; \
const c=JSON.parse(fs.readFileSync(p,'utf8')); \
const r=c['task-runners'].find(x=>x['runner-type']==='javascript'); \
if(!r) throw Error('Runner JavaScript no encontrado'); \
r['env-overrides'] ||= {}; \
const actual=r['env-overrides']['NODE_FUNCTION_ALLOW_EXTERNAL'] || ''; \
r['env-overrides']['NODE_FUNCTION_ALLOW_EXTERNAL']=[...new Set([...actual.split(',').filter(Boolean),'sharp'])].join(','); \
fs.writeFileSync(p,JSON.stringify(c,null,2));"

# Comprobar la dependencia
RUN cd /opt/runners/task-runner-javascript \
    && node -e "console.log('Sharp:', require('sharp').versions.sharp)"

USER runner
