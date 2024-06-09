import { useContext } from "react";
import ContextComponent from "../context/ContextComponent";

const MainPage = () => {
	const { darkMode } = useContext(ContextComponent);

    return (
        <div className="w-5/6 m-auto">
            <h1 className='font-bold mb-10 text-center mt-24 text-5xl'>Reformas Hee Hee</h1>
			
			<div className={`flex flex-col lg:flex-row gap-6 [&>*]:w-full lg:[&>*]:w-1/2 ${darkMode? '[&>*]:bg-slate-800':'[&>*]:bg-slate-300'} [&>*]:p-8 [&>*]:rounded-lg [&>*]:shadow-xl`}>
				<div>
					{/* <p className="text-2xl underline mb-4 font-bold">¡Bienvenido a Hee Hee!</p> */}
					<p className="underline text-2xl mb-2">Transformamos Sueños en Realidad</p>
					<p>
						Podemos decir con gran orgullo que ofrecemos servicios de albañilería excelsos, capaces de hacer realidad
						el hogar de tu sueños. Ya sea una renovación completa, una reforma parcial grande o pequeña,
						ponerle solución a un problema estructural o en la instalación de electrodomésticos y demás.
						Estamos aquí para ayudarte en cada paso de esta importante decisión.
					</p>
					<p className="font-semibold text-xl mt-4 mb-2">
						¿Por qué Elegirnos?
					</p>
					<ul className="list-disc ml-6 mb-4">
						<li className=" mt-4 mb-2">
							<span className="underline">Experiencia Profesional:</span> <br />Contamos con años de experiencia en el sector de la albañilería, nuestro equipo de expertos
							cuentan con la capacitación necesaria para poder ayudarte a planear tu proyecto, llevarlo a cabo
							y obtener el mejor resultado posible.
						</li>
						<li className=" mt-4 mb-2">
							<span className="underline">Compromiso con la Calidad:</span> <br />Nos esforzamos por superar
							las expectativas de nuestros clientes en términos de calidad y satisfacción.
							Cada proyecto se realiza con atención al detalle y dedicación total.
						</li>
						<li className=" mt-4 mb-2">
							<span className="underline">Soluciones Personalizadas:</span> <br /> Entendemos que cada hogar es único,
							por lo que ofrecemos soluciones personalizadas que se adaptan a tus necesidades específicas.
						</li>
					</ul>
					<img className="rounded border border-slate-400" src={`${darkMode? 'home_3.jpg':'home_2.jpg'}`} alt="" />
				</div>


				<div>
					<img className="rounded border border-slate-400" src={`${darkMode? 'home_5.jpg':'home_4.jpg'}`} alt="" />
						<p className="font-semibold text-xl mt-4 mb-2">¿Qué ofrecemos?</p>
						<ul className="list-disc ml-6 mb-4">
							<li className=" mt-4 mb-2">
								<span className="underline">Reformas Integrales:</span> Desde la demolición hasta los acabados finales,
								estamos aquí para hacer realidad tu visión de un hogar renovado.
							</li>
							<li className=" mt-4 mb-2">
								<span className="underline">Reparaciones y Mantenimiento:</span> Solucionamos problemas estructurales,
								grietas, filtraciones y demás, para garantizar la seguridad, durabilidad y confortabilidad de tu hogar.
							</li>
							<li className=" mt-4 mb-2">
								<span className="underline">Instalaciones Especializadas:</span> Realizamos instalaciones de revestimientos,
								pavimentos, azulejos, ladrillos y mucho más con habilidad y precisión.
							</li>
						</ul>
					<h2 className="font-semibold text-2xl mt-20">¡Empieza tu próximo proyecto ya!</h2>
					<p className="text-lg">A la izquierda de esta presentación podrás encontrar una sección llamada <b>{'"'}Proyecto{'"'}</b> donde tras
					un pequeño formulario podrá comenzar esta bonita etapa</p>
				</div>
			</div>
        </div>
    );
}

export default MainPage;
