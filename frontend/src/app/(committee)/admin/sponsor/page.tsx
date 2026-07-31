import type { Metadata } from 'next';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { PratinjauPenempatan } from '@/components/admin/sponsor/PratinjauPenempatan';
import { TombolTerbitkan } from '@/components/admin/sponsor/TombolTerbitkan';
import { StripAngka } from '@/components/admin/StripAngka';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  DAFTAR_SPONSOR,
  LABEL_TINGKAT,
  PANDUAN_LOGO,
  PERUBAHAN_BELUM_TERBIT,
} from '@/data/admin/sponsor';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import adm from '@/components/admin/adm.module.css';

export const metadata: Metadata = {
  title: 'Sponsor · Panitia',
  robots: { index: false, follow: false },
};

/**
 * `/admin/sponsor` — daftar sponsor dan pratinjau penempatannya (E4.1).
 *
 * Urutan tampil diubah lewat pegangan drag atau panah papan tik dan tersimpan
 * otomatis sebagai draf. Yang belum tersambung adalah endpoint penyimpanan
 * urutannya; tabel di bawah menampilkan urutan tersimpan apa adanya.
 */
export default async function SponsorPage() {
  const bermasalah = DAFTAR_SPONSOR.filter((s) => !s.memenuhiPanduan);
  const tayang = DAFTAR_SPONSOR.filter((s) => s.tayang);
  const perTingkat = (['utama', 'pendukung', 'media'] as const).map((t) => ({
    tingkat: t,
    jumlah: DAFTAR_SPONSOR.filter((s) => s.tingkat === t).length,
  }));

  return (
    <div className={adm.halaman}>
      <StripAngka
        angka={[
          { id: 'aktif', nilai: String(tayang.length), label: 'sponsor tayang di portal' },
          {
            id: 'tingkat',
            nilai: perTingkat.map((p) => p.jumlah).join(' · '),
            label: perTingkat.map((p) => LABEL_TINGKAT[p.tingkat]).join(' · '),
          },
          {
            id: 'bermasalah',
            nilai: String(bermasalah.length),
            label: 'logo belum memenuhi panduan ukuran',
            nada: bermasalah.length > 0 ? 'danger' : 'ok',
          },
          {
            id: 'draf',
            nilai: String(PERUBAHAN_BELUM_TERBIT),
            label: 'perubahan belum diterbitkan',
            nada: PERUBAHAN_BELUM_TERBIT > 0 ? 'warn' : undefined,
          },
        ]}
      />

      <div className={`${adm.panel} ${adm.panelNetral}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          <strong>Panduan ukuran logo.</strong> {PANDUAN_LOGO} Panduan ini dibaca sebelum memilih
          berkas; validasi final tetap dilakukan server.
        </p>
      </div>

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Daftar sponsor</h2>
          <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
            Tambah sponsor
          </button>
        </div>

        <TabelAdmin
          caption="Sponsor beserta tingkatan, berkas logo, dan status tayangnya"
          minLebar={940}
          kolom={[
            { label: 'Urutan', urut: 'naik' },
            { label: 'Sponsor' },
            { label: 'Tingkatan' },
            { label: 'Logo' },
            { label: 'Tautan' },
            { label: 'Status' },
            { label: 'Aksi' },
          ]}
        >
          {DAFTAR_SPONSOR.map((s) => (
            <tr key={s.id}>
              <td>{s.urutan}</td>
              <td>
                <strong>{s.nama}</strong>
              </td>
              <td>
                <Lencana label={LABEL_TINGKAT[s.tingkat]} nada="info" />
              </td>
              <td>
                <SelBertingkat
                  utama={`${s.formatLogo} · ${s.dimensiLogo}`}
                  meta={s.memenuhiPanduan ? undefined : 'di bawah lebar minimum'}
                />
              </td>
              <td>{s.tautan}</td>
              <td>
                {s.tayang ? (
                  <Lencana label="Tayang" nada="ok" ikon="centang" />
                ) : (
                  <Lencana
                    label={s.memenuhiPanduan ? 'Draf' : 'Draf · perlu logo baru'}
                    nada={s.memenuhiPanduan ? 'netral' : 'danger'}
                    ikon={s.memenuhiPanduan ? 'berkas' : 'seru'}
                  />
                )}
              </td>
              <td>
                <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                  {s.memenuhiPanduan ? 'Atur' : 'Ganti logo'}
                </button>
              </td>
            </tr>
          ))}
        </TabelAdmin>

        <KakiTabel
          ringkasan={`Menampilkan ${DAFTAR_SPONSOR.length} dari ${DAFTAR_SPONSOR.length} sponsor · satu halaman`}
          catatan="Urutan diubah dengan drag pegangan atau panah papan tik dan tersimpan otomatis sebagai draf. Tautan dibuka di tab baru dengan rel noopener; hanya http/https yang diterima."
        />
      </section>

      <PratinjauPenempatan
        sponsor={DAFTAR_SPONSOR}
        adaPerubahanBelumTerbit={PERUBAHAN_BELUM_TERBIT > 0}
      />

      <TombolTerbitkan
        jumlahBermasalah={bermasalah.length}
        jumlahPerubahan={PERUBAHAN_BELUM_TERBIT}
        waktuServerIso={WAKTU_SERVER_ISO}
        ringkasTingkat={perTingkat.map((p) => ({
          label: LABEL_TINGKAT[p.tingkat],
          nilai: `${p.jumlah} sponsor`,
        }))}
      />
    </div>
  );
}
