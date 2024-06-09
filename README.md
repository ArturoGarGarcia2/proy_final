# Introducción

Se nos presenta el caso de un trabajador del sector de la albañilería el cual quisiera tener un mayor control sobre los presupuestos y demás documentos que se generan a raíz de su trabajo y de las citas que tiene con los clientes, además de tener más contacto con los clientes que recurran a su servicio.
Con esto en mente, se hará una aplicación web con la cual pueda tener control de los proyectos que tiene activos cuando un cliente ingrese en la página para que también ellos puedan tener conocimiento del estado de su reforma, también que se pueda mandar presupuestos a los clientes y un método de control de citas para concretar detalles de la reforma.


## Guía de instalación

### Requisitos

1. git
2. node
3. composer
4. php
5. mysql

### Guía

1. Clonar el proyecto con

```git
git clone https://github.com/ArturoGarGarcia2/proy_final.git
```

2. Iniciar mysql

3. Acceder a la carpeta ProyFinal-BACK y ejecutar lo siguiente

```bash
composer install

php bin/console d:d:c 

symfonsy server:start
```

4. Acceder a la carpeta ProyFinal-FRONT y ejecutar lo siguiente

```bash
npm i

npm run dev
```

5. Acceder a http://localhost:5173

## Despliegue


Una vez clonado el repositorio

1. Acceder a la carpeta ProyFinal-BACK/.docker y ejecutar lo siguiente

```bash
docker-compose up -d --build
```

2. Acceder a la carpeta ProyFinal-FRONT y ejecutar lo siguiente

```bash
docker build --pull --rm -f "Dockerfile" -t proy-final-front:latest "."

docker run -d -p 5173:80 proy-final-front
```


3. Acceder a http://localhost:5173