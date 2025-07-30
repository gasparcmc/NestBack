// src/core/upload/upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { Request, Response } from 'express';
import { join } from 'path';
import { UploadedFile } from './uploadFile.interface';

@Injectable()
export class UploadService {


 

  // Configuración para txt
  private txtUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, join(__dirname, '../../uploads/txt')),
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/plain') {
        return cb(new BadRequestException('Solo archivos TXT'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 1 * 1024 * 1024 },
  });

  // Configuración para csv
  private csvUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, join(__dirname, '../../uploads/csv')),
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype !== 'text/csv' &&
        file.mimetype !== 'application/vnd.ms-excel'
      ) {
        return cb(new BadRequestException('Solo archivos CSV'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  });

  // Métodos para cada tipo de subida
  /**
   * Sube una imagen de portada con el nombre proveedor-<id>.<extensión>
   */
  uploadPortadaFile(
    req: Request,
    res: Response,
    fieldName: string,
    proveedorId: number
  ): Promise<UploadedFile> {
    // Configuración personalizada para el nombre del archivo
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, join(__dirname, '../../uploads/portadas'));
      },
      filename: (req, file, cb) => {
        // Obtener la extensión original
        const ext = file.originalname.split('.').pop();
        cb(null, `proveedor-${proveedorId}.${ext}`);
      },
    });
    const portadaUpload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req: Request, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Solo imágenes JPG, JPEG, PNG'), false);
        }
        cb(null, true);
      },
    });
    return new Promise((resolve, reject) => {
      portadaUpload.single(fieldName)(req, res, (err: unknown) => {
        if (err) {
          return reject(err);
        }
        resolve((req as unknown as { file: UploadedFile }).file);
      });
    });
  }

  uploadGaleriaFile(
  req: Request,
  res: Response,
  fieldName: string
): Promise<UploadedFile> {
  // Configuración personalizada para galería
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, join(__dirname, '../../uploads/galeria'));
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `galeria-${Date.now()}.${ext}`);
    },
  });

  const galeriaUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req: Request, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Solo imágenes JPG, JPEG, PNG'), false);
      }
      cb(null, true);
    },
  });

  return new Promise((resolve, reject) => {
    galeriaUpload.single(fieldName)(req, res, (err: unknown) => {
      if (err) {
        return reject(err);
      }
      resolve((req as unknown as { file: UploadedFile }).file);
    });
  });
}


  uploadTxtFile(req: Request, res: Response, fieldName: string): Promise<UploadedFile> {
    return this.handleUpload(this.txtUpload, req, res, fieldName);
  }

  uploadCsvFile(req: Request, res: Response, fieldName: string): Promise<UploadedFile> {
    return this.handleUpload(this.csvUpload, req, res, fieldName);
  }

  // Método genérico para manejar la subida
  private handleUpload(
    uploader: multer.Multer,
    req: Request,
    res: Response,
    fieldName: string
  ): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      uploader.single(fieldName)(req, res, (err: unknown) => {
        if (err) return reject(err);
        resolve((req as unknown as { file: UploadedFile }).file);
      });
    });
  }
}
