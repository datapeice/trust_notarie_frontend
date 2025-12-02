'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import axios from 'axios';

const formSchema = z.object({
  signerEmail: z.string().email({ message: "Invalid email address" }),
  signerFirstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  signerLastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  signerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: "Invalid Ethereum address" }).optional().or(z.literal('')),
});

export default function CreateDocument() {
  const { address } = useAccount();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signerEmail: "",
      signerFirstName: "",
      signerLastName: "",
      signerAddress: "",
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file || !address) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ownerAddress', address);
      formData.append('signerEmail', values.signerEmail);
      formData.append('signerFirstName', values.signerFirstName);
      formData.append('signerLastName', values.signerLastName);
      if (values.signerAddress) {
        formData.append('signerAddress', values.signerAddress);
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push(`/documents/${response.data.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Create New Document</CardTitle>
          <CardDescription>
            Upload a document and invite someone to sign it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>Document File</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, TXT, PNG, JPG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Signer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signerFirstName">Signer First Name</Label>
                <Input
                  id="signerFirstName"
                  placeholder="John"
                  {...form.register("signerFirstName")}
                />
                {form.formState.errors.signerFirstName && (
                  <p className="text-sm text-destructive">{form.formState.errors.signerFirstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signerLastName">Signer Last Name</Label>
                <Input
                  id="signerLastName"
                  placeholder="Doe"
                  {...form.register("signerLastName")}
                />
                {form.formState.errors.signerLastName && (
                  <p className="text-sm text-destructive">{form.formState.errors.signerLastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signerEmail">Signer Email</Label>
              <Input
                id="signerEmail"
                type="email"
                placeholder="john.doe@example.com"
                {...form.register("signerEmail")}
              />
              {form.formState.errors.signerEmail && (
                <p className="text-sm text-destructive">{form.formState.errors.signerEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signerAddress">Signer Wallet Address (Optional)</Label>
              <Input
                id="signerAddress"
                placeholder="0x..."
                {...form.register("signerAddress")}
              />
              {form.formState.errors.signerAddress && (
                <p className="text-sm text-destructive">{form.formState.errors.signerAddress.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                If provided, only this wallet can sign the document.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!file || isUploading}
            >
              {isUploading ? "Creating..." : "Create & Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
