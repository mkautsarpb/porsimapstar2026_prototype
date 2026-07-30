import { Ikon } from '@/components/app/Ikon';
import type { JadwalLomba } from '@/data/lomba-detail';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';

/** Tab Jadwal: seluruh agenda cabang ini, termasuk yang sudah lewat. */
export function TabJadwal({ jadwal }: { readonly jadwal: readonly JadwalLomba[] }) {
  if (jadwal.length === 0) {
    return (
      <div className={ui.kartu}>
        <p className={tab.kosong}>Belum ada jadwal yang diumumkan untuk cabang ini.</p>
      </div>
    );
  }

  return (
    <div className={ui.kartu}>
      <h2 className={tab.judul}>Seluruh agenda</h2>

      <ul className={tab.daftar}>
        {jadwal.map((j) => (
          <li key={j.id} className={tab.baris}>
            <span
              aria-hidden="true"
              className={`${tab.tanggal} ${j.status === 'selesai' ? tab.tanggalSelesai : ''}`}
            >
              <span className={tab.tanggalAngka}>{j.tanggal}</span>
              <span className={tab.tanggalBulan}>{j.bulan}</span>
            </span>

            <span className={tab.barisIsi}>
              <span className={tab.barisJudul}>{j.judul}</span>
              <span className={tab.barisKet}>
                {j.hari} · {j.keterangan}
              </span>
              <span className={tab.waktu}>
                {j.status === 'berubah' && j.jamLama ? <s className={tab.jamLama}>{j.jamLama}</s> : null}
                <span className={tab.jam}>{j.jam}</span>
                <span className={tab.venue}>· {j.venue}</span>
              </span>
            </span>

            {j.status === 'berubah' ? (
              <span data-nada="warn" className={ui.badge}>
                <Ikon nama="ulang" ukuran={12} tebal={2.2} />
                Jadwal berubah
              </span>
            ) : null}
            {j.status === 'selesai' ? <span className={ui.badge}>Selesai</span> : null}
          </li>
        ))}
      </ul>

      <div className={`${tab.info} ${tab.jarakAtas}`}>
        <span aria-hidden="true" className={tab.infoIkon}>
          <Ikon nama="jam" ukuran={16} />
        </span>
        <span>
          Semua waktu memakai WIB dan mengikuti jadwal resmi panitia. Perubahan jadwal selalu disertai
          notifikasi — jangan berpatokan pada tangkapan layar lama.
        </span>
      </div>
    </div>
  );
}
