import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ProgressService } from './progress.service';

@WebSocketGateway({ cors: true })
export class ProgressGateway {
  constructor(private readonly progressService: ProgressService) {}

  @SubscribeMessage('progress')
  async handleProgress(
    @MessageBody()
    data: {
      userId: string;
      courseId: string;
      lessonId: string;
      percent: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.progressService.saveProgress(
      data.userId,
      data.courseId,
      data.lessonId,
      data.percent,
    );
    client.emit('progress-confirmed', { status: 'ok', percent: data.percent });
  }
}
