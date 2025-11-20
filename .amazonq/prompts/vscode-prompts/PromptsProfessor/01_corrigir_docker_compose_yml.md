# Corrigir Docker Compose YML

Corrija o arquivo docker-compose.yml identificando e resolvendo:

- Erros de sintaxe YAML
- Problemas de indentação
- Configurações incorretas de serviços
- Dependências entre containers
- Variáveis de ambiente mal configuradas
- Problemas de rede e volumes
- Healthchecks ausentes ou incorretos

Forneça a correção completa do arquivo com explicação das mudanças realizadas.

Erro:

Ao executar o docker compose os containers não são criados e as seguntes mensagens são exibidas:

#1 [internal] load local bake definitions
#1 reading from stdin 1.30kB done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 220B 0.0s done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 1.3s

#4 [internal] load .dockerignore
#4 transferring context: 2B 0.0s done
#4 DONE 0.0s

#5 [1/5] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 30.66MB 5.0s

Erro na criação do pm20252_frontend_service:

maffeis@LAB2PROF:/mnt/c/Users/amaffeis/Documents/git.repo/pm2025-2/iadev/projects/horarioslabinf$ docker compose up pm20252_frontend_service -d
#1 [internal] load local bake definitions
#1 reading from stdin 1.30kB done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 520B 0.0s done
#2 DONE 0.1s

#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 1.0s

#4 [internal] load .dockerignore
#4 transferring context:
#4 transferring context: 161B 0.0s done
#4 DONE 0.2s

#5 [1/8] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 899B 0.1s done
#6 DONE 0.4s

#7 [4/8] COPY package*.json ./
#7 CACHED

#8 [5/8] RUN npm ci && npm cache clean --force
#8 CACHED

#9 [6/8] COPY . .
#9 CACHED

#10 [2/8] WORKDIR /app
#10 CACHED

#11 [3/8] RUN apk add --no-cache curl
#11 CACHED

#12 [7/8] RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
#12 CACHED

#13 [8/8] RUN chown -R nodejs:nodejs /app


Erro na execução do contaner pm20252_frontend_container:

Console do container:

No log line matching the '' filter

Log do Container:

{
    "AppArmorProfile": "",
    "Args": [
        "npm",
        "run",
        "dev",
        "--",
        "--host",
        "0.0.0.0",
        "--port",
        "3001"
    ],
    "Config": {
        "AttachStderr": true,
        "AttachStdin": false,
        "AttachStdout": true,
        "Cmd": [
            "npm",
            "run",
            "dev",
            "--",
            "--host",
            "0.0.0.0",
            "--port",
            "3001"
        ],
        "Domainname": "",
        "Entrypoint": [
            "docker-entrypoint.sh"
        ],
        "Env": [
            "VITE_API_URL=http://localhost:3000/api/v1",
            "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "NODE_VERSION=18.20.8",
            "YARN_VERSION=1.22.22",
            "PORT=3001"
        ],
        "ExposedPorts": {
            "3001/tcp": {}
        },
        "Healthcheck": {
            "Interval": 30000000000,
            "Retries": 3,
            "StartPeriod": 30000000000,
            "Test": [
                "CMD",
                "curl",
                "-f",
                "http://localhost:3001"
            ],
            "Timeout": 10000000000
        },
        "Hostname": "cde67b6eeb7c",
        "Image": "horarioslabinf-pm20252_frontend_service",
        "Labels": {
            "com.docker.compose.config-hash": "c76104df72e02cc8f010556444358bc832c786ad4ae626a6e1fc9ea57f136958",
            "com.docker.compose.container-number": "1",
            "com.docker.compose.depends_on": "pm20252_backend_service:service_healthy:false",
            "com.docker.compose.image": "sha256:92f6b2d62c4fc3fcb9d92fae668459f18991e437924a244ec3058899abd316e3",
            "com.docker.compose.oneoff": "False",
            "com.docker.compose.project": "horarioslabinf",
            "com.docker.compose.project.config_files": "/mnt/c/Users/amaffeis/Documents/git.repo/pm2025-2/iadev/projects/horarioslabinf/docker-compose.yml",
            "com.docker.compose.project.working_dir": "/mnt/c/Users/amaffeis/Documents/git.repo/pm2025-2/iadev/projects/horarioslabinf",
            "com.docker.compose.service": "pm20252_frontend_service",
            "com.docker.compose.version": "2.39.1"
        },
        "OnBuild": null,
        "OpenStdin": false,
        "StdinOnce": false,
        "Tty": false,
        "User": "nodejs",
        "Volumes": null,
        "WorkingDir": "/app"
    },
    "Created": "2025-10-16T17:51:42.509083779Z",
    "Driver": "overlay2",
    "ExecIDs": null,
    "GraphDriver": {
        "Data": {
            "ID": "cde67b6eeb7c381697853676e1dbf5bc0b57bbb7049682a30d4e0e0689cc77a7",
            "LowerDir": "/var/lib/docker/overlay2/cc33a1fbd6c185b6725977c50bfda1e7ec079d0010d8ea1f1d8ee52d733d2aa4-init/diff:/var/lib/docker/overlay2/t5vbhyy6i8j8210d2b8wc4bfc/diff:/var/lib/docker/overlay2/o1pzia85zau4sqj1n0kax5gp7/diff:/var/lib/docker/overlay2/ld6vd3yv03vcjuazisf5wh9bj/diff:/var/lib/docker/overlay2/bhrk1hk6itexvhf8z08nx8jzi/diff:/var/lib/docker/overlay2/dzm1hov8nehlp0s1eba8yf0cg/diff:/var/lib/docker/overlay2/we27wbcbemlgg62grn7zrh8uq/diff:/var/lib/docker/overlay2/2a66d87a766b26a81ed0e6269c7cf2a65d2e0110dafdde47b6912e3f30509ea4/diff:/var/lib/docker/overlay2/b6f5533b35628b254e23686a0691a66fbc4a5181064a181dbfaf2ded68b63d8a/diff:/var/lib/docker/overlay2/a9ab093577bced7428bdc23e27959636ca4314efef34abca42d9a5623874a45c/diff:/var/lib/docker/overlay2/634bcc9034f59649c686760ede10ec371f4777389964ed6335ebf9a4fabc653f/diff",
            "MergedDir": "/var/lib/docker/overlay2/cc33a1fbd6c185b6725977c50bfda1e7ec079d0010d8ea1f1d8ee52d733d2aa4/merged",
            "UpperDir": "/var/lib/docker/overlay2/cc33a1fbd6c185b6725977c50bfda1e7ec079d0010d8ea1f1d8ee52d733d2aa4/diff",
            "WorkDir": "/var/lib/docker/overlay2/cc33a1fbd6c185b6725977c50bfda1e7ec079d0010d8ea1f1d8ee52d733d2aa4/work"
        },
        "Name": "overlay2"
    },
    "HostConfig": {
        "AutoRemove": false,
        "Binds": null,
        "BlkioDeviceReadBps": null,
        "BlkioDeviceReadIOps": null,
        "BlkioDeviceWriteBps": null,
        "BlkioDeviceWriteIOps": null,
        "BlkioWeight": 0,
        "BlkioWeightDevice": null,
        "CapAdd": null,
        "CapDrop": null,
        "Cgroup": "",
        "CgroupParent": "",
        "CgroupnsMode": "private",
        "ConsoleSize": [
            0,
            0
        ],
        "ContainerIDFile": "",
        "CpuCount": 0,
        "CpuPercent": 0,
        "CpuPeriod": 0,
        "CpuQuota": 0,
        "CpuRealtimePeriod": 0,
        "CpuRealtimeRuntime": 0,
        "CpuShares": 0,
        "CpusetCpus": "",
        "CpusetMems": "",
        "DeviceCgroupRules": null,
        "DeviceRequests": null,
        "Devices": null,
        "Dns": null,
        "DnsOptions": null,
        "DnsSearch": null,
        "ExtraHosts": [],
        "GroupAdd": null,
        "IOMaximumBandwidth": 0,
        "IOMaximumIOps": 0,
        "IpcMode": "private",
        "Isolation": "",
        "Links": null,
        "LogConfig": {
            "Config": {},
            "Type": "json-file"
        },
        "MaskedPaths": [
            "/proc/asound",
            "/proc/acpi",
            "/proc/interrupts",
            "/proc/kcore",
            "/proc/keys",
            "/proc/latency_stats",
            "/proc/timer_list",
            "/proc/timer_stats",
            "/proc/sched_debug",
            "/proc/scsi",
            "/sys/firmware",
            "/sys/devices/virtual/powercap"
        ],
        "Memory": 0,
        "MemoryReservation": 0,
        "MemorySwap": 0,
        "MemorySwappiness": null,
        "NanoCpus": 0,
        "NetworkMode": "horarioslabinf_pm20252_network",
        "OomKillDisable": false,
        "OomScoreAdj": 0,
        "PidMode": "",
        "PidsLimit": null,
        "PortBindings": {
            "3001/tcp": [
                {
                    "HostIp": "",
                    "HostPort": "3001"
                }
            ]
        },
        "Privileged": false,
        "PublishAllPorts": false,
        "ReadonlyPaths": [
            "/proc/bus",
            "/proc/fs",
            "/proc/irq",
            "/proc/sys",
            "/proc/sysrq-trigger"
        ],
        "ReadonlyRootfs": false,
        "RestartPolicy": {
            "MaximumRetryCount": 3,
            "Name": "on-failure"
        },
        "Runtime": "runc",
        "SecurityOpt": null,
        "ShmSize": 67108864,
        "UTSMode": "",
        "Ulimits": null,
        "UsernsMode": "",
        "VolumeDriver": "",
        "VolumesFrom": null
    },
    "HostnamePath": "",
    "HostsPath": "",
    "Id": "cde67b6eeb7c381697853676e1dbf5bc0b57bbb7049682a30d4e0e0689cc77a7",
    "Image": "sha256:92f6b2d62c4fc3fcb9d92fae668459f18991e437924a244ec3058899abd316e3",
    "LogPath": "/var/lib/docker/containers/cde67b6eeb7c381697853676e1dbf5bc0b57bbb7049682a30d4e0e0689cc77a7/cde67b6eeb7c381697853676e1dbf5bc0b57bbb7049682a30d4e0e0689cc77a7-json.log",
    "MountLabel": "",
    "Mounts": [],
    "Name": "/pm20252_frontend_container",
    "NetworkSettings": {
        "Bridge": "",
        "EndpointID": "",
        "Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "HairpinMode": false,
        "IPAddress": "",
        "IPPrefixLen": 0,
        "IPv6Gateway": "",
        "LinkLocalIPv6Address": "",
        "LinkLocalIPv6PrefixLen": 0,
        "MacAddress": "",
        "Networks": {
            "horarioslabinf_pm20252_network": {
                "Aliases": [
                    "pm20252_frontend_container",
                    "pm20252_frontend_service",
                    "cde67b6eeb7c"
                ],
                "DNSNames": null,
                "DriverOpts": null,
                "EndpointID": "",
                "Gateway": "",
                "GlobalIPv6Address": "",
                "GlobalIPv6PrefixLen": 0,
                "GwPriority": 0,
                "IPAMConfig": null,
                "IPAddress": "",
                "IPPrefixLen": 0,
                "IPv6Gateway": "",
                "Links": null,
                "MacAddress": "",
                "NetworkID": ""
            }
        },
        "Ports": {},
        "SandboxID": "",
        "SandboxKey": "",
        "SecondaryIPAddresses": null,
        "SecondaryIPv6Addresses": null
    },
    "Path": "docker-entrypoint.sh",
    "Platform": "linux",
    "ProcessLabel": "",
    "ResolvConfPath": "",
    "RestartCount": 0,
    "State": {
        "Dead": false,
        "Error": "",
        "ExitCode": 0,
        "FinishedAt": "0001-01-01T00:00:00Z",
        "OOMKilled": false,
        "Paused": false,
        "Pid": 0,
        "Restarting": false,
        "Running": false,
        "StartedAt": "0001-01-01T00:00:00Z",
        "Status": "created"
    }
}

erro na execução do container frontend:


      
> frontend@0.0.0 dev

> vite --host 0.0.0.0 --port 3001

You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.

failed to load config from /app/vite.config.js

error when starting dev server:

Error: EACCES: permission denied, open '/app/vite.config.js.timestamp-1760637455815-d1ab1dc786b9f.mjs'

npm notice

npm notice New major version of npm available! 10.8.2 -> 11.6.2

npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2

npm notice To update run: npm install -g npm@11.6.2

npm notice

> frontend@0.0.0 dev

> vite --host 0.0.0.0 --port 3001

You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.

failed to load config from /app/vite.config.js

error when starting dev server:

Error: EACCES: permission denied, open '/app/vite.config.js.timestamp-1760637456845-f247764d1f6e1.mjs'

> frontend@0.0.0 dev

> vite --host 0.0.0.0 --port 3001

You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.

failed to load config from /app/vite.config.js

error when starting dev server:

Error: EACCES: permission denied, open '/app/vite.config.js.timestamp-1760637457781-20fe4ae7df99.mjs'

> frontend@0.0.0 dev

> vite --host 0.0.0.0 --port 3001

You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.

failed to load config from /app/vite.config.js

error when starting dev server: