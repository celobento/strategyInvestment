'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateAsset, getAssets, getAssetTypes, getCategories, getCountries, getSectors, getSegments } from '@/lib/api'

const INCOME_TYPE_ITEMS = [
  { value: 'FIXED', label: 'Fixed Income' },
  { value: 'VARIABLE', label: 'Variable Income' },
]

const schema = z.object({
  name: z.string().min(2).max(200),
  ticket: z.string().min(1).max(10),
  description: z.string().min(2).max(250).optional().or(z.literal('')),
  country: z.coerce.number().int().positive(),
  category: z.coerce.number().int().positive(),
  sector: z.coerce.number().int().positive(),
  segment: z.coerce.number().int().positive(),
  incomeType: z.enum(['FIXED', 'VARIABLE']).optional(),
  assetTypeId: z.coerce.number().int().positive().optional(),
})
type FormValues = z.infer<typeof schema>

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Load asset from list cache (no auth-guarded single endpoint needed)
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => getAssets(),
  })
  const asset = assets.find((a) => a.id === Number(id))

  const { data: countries = [] } = useQuery({ queryKey: ['countries'], queryFn: () => getCountries() })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: () => getCategories() })
  const { data: sectors = [] } = useQuery({ queryKey: ['sectors'], queryFn: () => getSectors() })
  const { data: segments = [] } = useQuery({ queryKey: ['segments'], queryFn: getSegments })
  const { data: assetTypes = [] } = useQuery({ queryKey: ['asset-types'], queryFn: () => getAssetTypes() })

  const countryItems = countries.map((c) => ({ value: String(c.id), label: `${c.name} (${c.acronym})` }))
  const categoryItems = categories.map((c) => ({ value: String(c.id), label: c.name }))
  const sectorItems = sectors.map((s) => ({ value: String(s.id), label: s.name }))
  const segmentItems = segments.map((s) => ({ value: String(s.id), label: s.name }))
  const assetTypeItems = assetTypes.map((at) => ({ value: String(at.id), label: at.name }))

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { name: '', ticket: '', description: '' },
  })

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        ticket: asset.ticket,
        description: asset.description ?? '',
        country: asset.country?.id,
        category: asset.category?.id,
        sector: asset.sector?.id,
        segment: asset.segment?.id,
        incomeType: asset.incomeType,
        assetTypeId: asset.assetType?.id,
      })
    }
  }, [asset, reset])

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updateAsset(Number(id), {
      name: data.name,
      ticket: data.ticket,
      description: data.description || undefined,
      country: data.country,
      category: data.category,
      sector: data.sector,
      segment: data.segment,
      incomeType: data.incomeType,
      assetTypeId: data.assetTypeId,
    }),
    onSuccess: () => {
      toast.success('Asset updated')
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      router.push('/assets')
    },
    onError: () => toast.error('Failed to update asset'),
  })

  if (isLoading) return <div className="p-6 text-muted-foreground text-sm">Loading...</div>
  if (!isLoading && !asset) return (
    <div className="p-6">
      <p className="text-destructive text-sm">Asset not found.</p>
      <Link href="/assets" className="text-sm text-muted-foreground hover:underline mt-2 inline-block">← Assets</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/assets" className="text-sm text-muted-foreground hover:text-foreground">
          ← Assets
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Asset</CardTitle>
          <CardDescription>{asset?.ticket} — {asset?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket">Ticker</Label>
              <Input id="ticket" {...register('ticket')} />
              {errors.ticket && <p className="text-sm text-destructive">{errors.ticket.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={3} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select value={field.value != null ? String(field.value) : ''} onValueChange={field.onChange} items={countryItems}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a country" /></SelectTrigger>
                    <SelectContent>
                      {countryItems.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value != null ? String(field.value) : ''} onValueChange={field.onChange} items={categoryItems}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {categoryItems.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Sector</Label>
              <Controller
                control={control}
                name="sector"
                render={({ field }) => (
                  <Select value={field.value != null ? String(field.value) : ''} onValueChange={field.onChange} items={sectorItems}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a sector" /></SelectTrigger>
                    <SelectContent>
                      {sectorItems.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sector && <p className="text-sm text-destructive">{errors.sector.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Segment</Label>
              <Controller
                control={control}
                name="segment"
                render={({ field }) => (
                  <Select value={field.value != null ? String(field.value) : ''} onValueChange={field.onChange} items={segmentItems}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a segment" /></SelectTrigger>
                    <SelectContent>
                      {segmentItems.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.segment && <p className="text-sm text-destructive">{errors.segment.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Income Type</Label>
              <Controller
                control={control}
                name="incomeType"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) => field.onChange(v || undefined)}
                    items={INCOME_TYPE_ITEMS}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select income type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_TYPE_ITEMS.map((it) => (
                        <SelectItem key={it.value} value={it.value}>{it.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Asset Type</Label>
              <Controller
                control={control}
                name="assetTypeId"
                render={({ field }) => (
                  <Select
                    value={field.value != null ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    items={assetTypeItems}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select asset type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypeItems.map((at) => (
                        <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assetTypeId && <p className="text-sm text-destructive">{errors.assetTypeId.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
