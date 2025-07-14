
import { Readable, Writable } from 'stream';

export class StreamUtils {
  static async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  static async streamToString(stream: Readable, encoding: BufferEncoding = 'utf8'): Promise<string> {
    const buffer = await this.streamToBuffer(stream);
    return buffer.toString(encoding);
  }

  static bufferToStream(buffer: Buffer): Readable {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  static stringToStream(str: string, encoding: BufferEncoding = 'utf8'): Readable {
    return this.bufferToStream(Buffer.from(str, encoding));
  }

  static async pipelineAsync(source: Readable, destination: Writable): Promise<void> {
    return new Promise((resolve, reject) => {
      source.pipe(destination);
      destination.on('finish', resolve);
      destination.on('error', reject);
      source.on('error', reject);
    });
  }
}
