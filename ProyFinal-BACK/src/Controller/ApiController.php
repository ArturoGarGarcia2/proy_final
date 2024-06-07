<?php

namespace App\Controller;

use App\Entity\Meeting;
use App\Form\MeetingType;
use App\Repository\MeetingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/api')]
class ApiController extends AbstractController
{
    #[Route('/meeting', name: 'api_meeting_index', methods: ['GET'])]
    public function index(MeetingRepository $meetingRepository, SerializerInterface $serializerInterface): Response
    {
        // Obtener todas las reuniones
        $meetings = $meetingRepository->findAll();

        // Array para almacenar los resultados finales
        $result = [];

        // Iterar sobre cada reunión
        foreach ($meetings as $meeting) {
            // Obtener el proyecto y el cliente asociados a la reunión
            $project = $meeting->getProject();
            $client = $project->getClient();

            // Construir un array personalizado con la reunión, el proyecto y el cliente
            $result[] = [
                'meeting' => $meeting,
                'project' => $project,
                'client' => $client,
            ];
                // dd($meeting,$project,$client,$result);
        }


        $response =  $serializerInterface->serialize([
            'result'=>$result,
        ], 'json');
 
        return new JsonResponse($response, 200, [
            'Content-Type' => 'application/json',
        ], true);
    }
}
