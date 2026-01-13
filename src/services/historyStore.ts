import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface HistoryRecord {
  mission: string;
  concentration: number;
  purity: string;
  status: string;
  created_at?: string;
}

export interface HistoryStore {
  subscribeHistory(userId: string, callback: (records: HistoryRecord[]) => void): () => void;
  addHistoryRecord(userId: string, record: HistoryRecord): Promise<void>;
  fetchHistory(userId: string): Promise<HistoryRecord[]>;
}

export class SupabaseHistoryStore implements HistoryStore {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async fetchHistory(userId: string): Promise<HistoryRecord[]> {
    const { data } = await this.client
      .from('lab_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }

  subscribeHistory(userId: string, callback: (records: HistoryRecord[]) => void): () => void {
    this.fetchHistory(userId).then(callback);

    const subscription = this.client
      .channel('lab_history_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'lab_history', filter: `user_id=eq.${userId}` },
        () => {
          this.fetchHistory(userId).then(callback);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async addHistoryRecord(userId: string, record: HistoryRecord): Promise<void> {
    await this.client.from('lab_history').insert({
      user_id: userId,
      mission: record.mission,
      concentration: record.concentration,
      purity: record.purity,
      status: record.status,
      created_at: record.created_at || new Date().toISOString()
    });
  }
}

export class BoltHistoryStore implements HistoryStore {
  subscribeHistory(_userId: string, _callback: (records: HistoryRecord[]) => void): () => void {
    return () => {};
  }

  async addHistoryRecord(_userId: string, _record: HistoryRecord): Promise<void> {
    return Promise.resolve();
  }

  async fetchHistory(_userId: string): Promise<HistoryRecord[]> {
    return [];
  }
}
